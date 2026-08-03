import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

/**
 * Email Authentication
 */
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

/**
 * Google Authentication
 */
router.post("/google", AuthController.googleLogin);

/**
 * Password Management
 */
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

/**
 * User Session
 */
router.get("/me", authenticate, AuthController.getCurrentUser);

router.post("/logout", authenticate, AuthController.logout);

/**
 * Token Validation
 */
router.get("/verify", authenticate, AuthController.verifyToken);

export default router;
