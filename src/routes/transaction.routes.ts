import { Router } from "express";
import withAuth from "../middlewares/withAuth.js";
import {
  depositController,
  getTransactionsController,
} from "../controllers/transaction.controllers.js";

const router = Router();
router.post("/transactions/deposit", withAuth, depositController);
router.get("/transactions", withAuth, getTransactionsController);

export default router;
