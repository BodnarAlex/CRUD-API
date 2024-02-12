import * as dotenv from "dotenv";
import App from "./App";

dotenv.config();

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

export const app = new App();

  try {
    app.listen(+PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
