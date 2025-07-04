import { createServer, request } from "http";
import { parse } from "url";
import { availableParallelism } from "os";
import cluster from "cluster";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_PORT } from "./common/constant";
import { IPCResponse, IPCRequest, User } from "./common/types";

dotenv.config();

const PORT = Number(process.env.WORKER_PORT) || DEFAULT_PORT;
const WORKERS = availableParallelism() - 1;

if (process.env.MULTI === "true" && cluster.isPrimary) {
  let users: User[] = [];

  let current = 0;
  const workers: { pid: number; port: number }[] = [];

  console.log(`Primary ${process.pid} is running, forking ${WORKERS} workers`);

  for (let i = 0; i < WORKERS; i++) {
    const port = PORT + i + 1;
    const w = cluster.fork({ WORKER_PORT: port.toString() });
    if (w.process.pid) workers.push({ pid: w.process.pid, port });
    w.on("message", (msg: IPCRequest) => {
      let resp: IPCResponse;

      console.log(`Worker: ${msg.type} on PORT ${port} `);

      switch (msg.type) {
        case "GET_ALL":
          resp = { status: 200, payload: users, requestId: msg.requestId };
          break;
        case "GET_ONE":
          const u = users.find(u => u.id === msg.id);
          resp = u
            ? { status: 200, payload: u, requestId: msg.requestId }
            : { status: 404, payload: { message: "Not found" }, requestId: msg.requestId };
          break;
        case "CREATE":
          const newU = { id: uuidv4(), ...msg.data };
          users.push(newU);
          resp = { status: 201, payload: newU, requestId: msg.requestId };
          break;
        case "UPDATE":
          const idx = users.findIndex(u => u.id === msg.id);
          if (idx === -1) {
            resp = { status: 404, payload: { message: "Not found" }, requestId: msg.requestId };
          } else {
            users[idx] = { ...users[idx], ...msg.data };
            resp = { status: 200, payload: users[idx], requestId: msg.requestId };
          }
          break;
        case "DELETE":
          const i0 = users.findIndex(u => u.id === msg.id);
          if (i0 === -1) {
            resp = { status: 404, payload: { message: "Not found" }, requestId: msg.requestId };
          } else {
            users.splice(i0, 1);
            resp = { status: 204, payload: null, requestId: msg.requestId };
          }
          break;
      }

      w.send(resp);
    });
  }

  const balancer = createServer((req, res) => {
    const target = workers[current % workers.length];
    current++;
    const opts = { hostname: "localhost", port: target.port, path: req.url, method: req.method, headers: req.headers };
    const proxy = request(opts, r2 => {
      res.writeHead(r2.statusCode||500, r2.headers);
      r2.pipe(res);
    });
    proxy.on("error", () => res.writeHead(500).end("err"));
    req.pipe(proxy);
  });
  balancer.listen(PORT, () => console.log(`Loader balancer on ${PORT}`));

} else {
  const port = Number(process.env.WORKER_PORT || PORT);
  const app = createServer(async (req, res) => {
    try {
      const { pathname } = parse(req.url||"", true);
      const body = await (async () => {
        if (["POST","PUT"].includes(req.method||"")) {
          let buf=""; for await(const ch of req) buf+=ch;
          return JSON.parse(buf||"{}");
        }
        return null;
      })();

    const rid = `${Date.now()}-${Math.random()}`;
    let ipcReq: IPCRequest|undefined;

    if (pathname === "/api/users" && req.method==="GET")        ipcReq = { type:"GET_ALL", requestId:rid };
    else if (pathname?.startsWith("/api/users/") && req.method==="GET") {
      const id = pathname.split("/")[3]; ipcReq = { type:"GET_ONE", id, requestId:rid };
    }
    else if (pathname === "/api/users" && req.method==="POST")   ipcReq = { type:"CREATE", data:body, requestId:rid };
    else if (pathname?.startsWith("/api/users/") && req.method==="PUT") {
      const id = pathname.split("/")[3]; ipcReq = { type:"UPDATE", id, data:body, requestId:rid };
    }
    else if (pathname?.startsWith("/api/users/") && req.method==="DELETE") {
      const id = pathname.split("/")[3]; ipcReq = { type:"DELETE", id, requestId:rid };
    }

    if (!ipcReq) {
      res.writeHead(404,{"Content-Type":"application/json"}).end(JSON.stringify({message:"Not Found"}));
      return;
    }

    process.send!(ipcReq);

    const onMsg = (msg: IPCResponse) => {
      if (msg.requestId !== rid) return;
      res.writeHead(msg.status, {"Content-Type":"application/json"});
      res.end(msg.payload!==null ? JSON.stringify(msg.payload) : undefined);
      process.off("message", onMsg);
    };
    process.on("message", onMsg);
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "An internal server error occurred" }));
  }
  });

  app.listen(port, () => {
    console.log(`Worker ${process.pid} on port ${port}`);
  });
}
