import { createServer } from "http";
import { parse } from "url";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import { DEFAULT_PORT } from "./common/constant";

dotenv.config();

const PORT = Number(process.env.PORT) || DEFAULT_PORT;

const app = createServer((req, res) => {
  try {
    const { pathname } = parse(req.url || "", true);
    const handled = userRoutes(req, res, pathname || "");

    if (!handled) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Endpoint not found" }));
    }
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "An internal server error occurred" }));
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;