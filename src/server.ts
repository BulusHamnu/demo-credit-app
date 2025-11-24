import express from "express";
import { PORT } from "./config/env.js";

const app = express();

// start server
app.listen(PORT, () => {
  console.log(`Server started and runing on 127.0.0.1:${PORT}`);
});
