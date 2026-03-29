import { Router } from "express";
import withAuth from "../middlewares/withAuth.js";
import * as transactionController from "../controllers/transaction.controllers.js";

const router = Router();
router.get("/transactions", withAuth, transactionController.getTransactions);

export default router;
