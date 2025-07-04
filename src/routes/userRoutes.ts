import { IncomingMessage, ServerResponse } from "http";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController";

const userRoutes = (req: IncomingMessage, res: ServerResponse, pathname: string): boolean => {
  console.log(`Request: ${req.method} ${req.url} on PORT ${req.socket.localPort} `);

  if (pathname === "/api/users" && req.method === "GET") {
    getUsers(req, res);
    return true;
  }

  const userIdMatch = pathname.match(/^\/api\/users\/([0-9a-fA-F-]+)$/);

  if (userIdMatch && req.method === "GET") {
    req.url = userIdMatch[1];
    getUserById(req, res);
    return true;
  }
  if (pathname === "/api/users" && req.method === "POST") {
    createUser(req, res);
    return true;
  }
  if (userIdMatch && req.method === "PUT") {
    req.url = userIdMatch[1];
    updateUser(req, res);
    return true;
  }
  if (userIdMatch && req.method === "DELETE") {
    req.url = userIdMatch[1];
    deleteUser(req, res);
    return true;
  }
  return false;
};

export default userRoutes;
