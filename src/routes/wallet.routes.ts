import { Router } from "express";
import * as walletController from "../controllers/wallet.controllers.js";
import withAuth from "../middlewares/withAuth.js";

const router = Router();
router.post("/wallets", withAuth, walletController.createNewWallet);
router.get("/wallets", withAuth, walletController.getWallet);

export default router;
