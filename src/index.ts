import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import { DEFAULT_PORT } from "./common/constant";

dotenv.config();
const app = express();
const PORT = process.env.PORT || DEFAULT_PORT;

app.use(express.json());
app.use("/api", userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: "An internal server error occurred" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});