import { Router } from "express";
import { register, login, getProfile, getStats } from "../controllers/auth";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.get("/stats", getStats);

export default router;
