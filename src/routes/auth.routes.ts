import { Router } from "express";
import * as authController from "../controllers/auth.controllers.js";

const router = Router();
router.post("/auth/register", authController.signup);
router.post("/auth/login", authController.login);

export default router;
