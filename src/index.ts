import * as dotenv from "dotenv";
import App from "./App";
import { DEFAULT_PORT } from "./common/constant";

dotenv.config();

export const app = new App();

const { envArg } = process.env;
const PORT = parseInt(envArg, 10) || DEFAULT_PORT;

try {
  app.listen(+PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
} catch (e) {
  throw new Error(e);
}
