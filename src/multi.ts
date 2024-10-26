import cluster from "cluster";
import os from "os";
import "./index.ts";

const numCPUs = os.availableParallelism ? os.availableParallelism() - 1 : os.cpus().length - 1;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  for (let i = 1; i <= numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died, forking a new one.`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);
}
