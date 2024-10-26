import { createServer } from "http";
import { parse } from "url";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import { DEFAULT_PORT } from "./common/constant";

dotenv.config();

const PORT = process.env.PORT || DEFAULT_PORT;

const app = createServer((req, res) => {
  const { pathname } = parse(req.url || "", true);

  const handled = userRoutes(req, res, pathname);

  if (!handled) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Endpoint not found" }));
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;