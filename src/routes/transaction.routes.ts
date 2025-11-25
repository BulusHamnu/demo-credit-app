import { Router } from "express";
import withAuth from "../middlewares/withAuth.js";
import {
  depositController,
  getTransactionsController,
  transferController,
  withdrawController,
} from "../controllers/transaction.controllers.js";

const router = Router();
router.post("/transactions/deposit", withAuth, depositController);
router.get("/transactions", withAuth, getTransactionsController);
router.post("/transactions/transfer", withAuth, transferController);
router.post("/transactions/withdraw", withAuth, withdrawController);

export default router;
