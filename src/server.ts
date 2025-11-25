import express, { type Request, type Response } from "express";
import { PORT } from "./config/env.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
const app = express();

// middlewares
app.use(express.json());

// routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});
app.use("/api", authRoutes);
app.use("/api", walletRoutes);

// error handler
app.use(errorHandler);

// start server
app.listen(PORT, () => {
  console.log(`Server started and runing on 127.0.0.1:${PORT}`);
});
