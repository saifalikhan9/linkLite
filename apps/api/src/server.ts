import app from "./app";
import { ENV } from "./config/env";


app.listen(ENV.PORT, () => {
  console.log(`server listening on port ${ENV.PORT}`);
});
