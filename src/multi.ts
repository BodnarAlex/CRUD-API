import cluster from "cluster";
import os from "os";
import express from "express";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
import { DEFAULT_PORT } from "./common/constant";

dotenv.config();

const numCPUs = os.availableParallelism ? os.availableParallelism() - 1 : os.cpus().length - 1;
const PORT = +process.env.PORT || DEFAULT_PORT;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  for (let i = 1; i <= numCPUs; i++) {
    cluster.fork({ PORT: PORT + i });
  }
} else {
  const app = express();
  app.use(express.json());
  app.use("/api", userRoutes);

  const workerPort = process.env.PORT || DEFAULT_PORT + (cluster.worker?.id ?? 1);
  app.listen(workerPort, () => {
    console.log(`Worker ${process.pid} started on port ${workerPort}`);
  });
}