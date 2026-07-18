import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { adminMiddleware } from "../middleware/admin";
import {
  getAdminDashboardStats,
  getAllBookingsPaginated,
  getAllUsersList,
} from "../controllers/admin";

const router = Router();

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

router.get("/stats", getAdminDashboardStats);
router.get("/bookings", getAllBookingsPaginated);
router.get("/users", getAllUsersList);

export default router;
