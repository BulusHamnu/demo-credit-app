import { Router } from "express";
import {
  createNewWalletController,
  getUserWalletController,
} from "../controllers/wallet.controllers.js";
import withAuth from "../middlewares/withAuth.js";

const router = Router();
router.post("/wallets", withAuth, createNewWalletController);
router.get("/wallets", withAuth, getUserWalletController);

export default router;
