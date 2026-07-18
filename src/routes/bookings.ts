import { Router } from "express";
import {
  bookItem,
  getMyBookings,
  getBookingStatsEndpoint,
  updateBookingStatusController,
} from "../controllers/booking";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, bookItem);
router.get("/my-bookings", authMiddleware, getMyBookings);
router.get("/stats", authMiddleware, getBookingStatsEndpoint);
router.patch("/:id/status", authMiddleware, updateBookingStatusController);

export default router;
