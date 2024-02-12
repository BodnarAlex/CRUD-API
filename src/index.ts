import * as dotenv from "dotenv";
import App from "./App";

dotenv.config();

export const app = new App();

const { envArg } = process.env;
const PORT = parseInt(envArg, 10) || 3000;

  try {
    app.listen(+PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
