import { Router } from "express";
import withAuth from "../middlewares/withAuth.js";
import * as transactionController from "../controllers/transaction.controllers.js";

const router = Router();
router.post(
  "/transactions/deposit",
  withAuth,
  transactionController.depositFunds,
);
router.get("/transactions", withAuth, transactionController.getTransactions);
router.post(
  "/transactions/transfer",
  withAuth,
  transactionController.transferFunds,
);
router.post(
  "/transactions/withdraw",
  withAuth,
  transactionController.withdrawFunds,
);

export default router;
