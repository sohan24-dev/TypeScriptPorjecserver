import { Response } from "express";
import {
  createBooking,
  getUserBookings,
  getBookingStats,
  updateBookingStatus,
  bookingsCollection,
} from "../models/Booking";
import { AuthRequest } from "../middleware/auth";
import { ObjectId } from "mongodb";

export const bookItem = async (req: AuthRequest, res: Response) => {
  try {
    const {
      propertyId,
      propertyTitle,
      propertyImage,
      propertyLocation,
      checkIn,
      checkOut,
      guests,
      totalPrice,
    } = req.body;

    if (!propertyId || !propertyTitle || !checkIn || !checkOut || !totalPrice) {
      return res.status(400).json({
        message: "Property ID, title, check-in, check-out, and price are required",
      });
    }

    const result = await createBooking({
      propertyId,
      propertyTitle,
      propertyImage: propertyImage || "",
      propertyLocation: propertyLocation || "",
      userId: req.user!.userId,
      userName: req.user!.email.split("@")[0] || "Guest",
      userEmail: req.user!.email,
      checkIn,
      checkOut,
      guests: guests || 1,
      totalPrice: Number(totalPrice),
      status: "confirmed",
    });

    res.status(201).json({
      message: "Booking confirmed successfully!",
      bookingId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Server error creating booking" });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await getUserBookings(req.user!.userId);
    const bookingsWithStringIds = bookings.map((b) => ({
      ...b,
      _id: b._id!.toString(),
    }));
    res.json({ bookings: bookingsWithStringIds });
  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBookingStatsEndpoint = async (req: AuthRequest, res: Response) => {
  try {
    // If user is admin and a userId query param is provided, get stats for that user
    // Otherwise, for regular users, return their own stats
    const targetUserId =
      req.query.userId && req.user?.role === "admin"
        ? (req.query.userId as string)
        : req.user?.userId;

    const stats = await getBookingStats(targetUserId);
    res.json(stats);
  } catch (error) {
    console.error("Booking stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBookingStatusController = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ message: "Booking ID and status are required" });
    }

    if (!["confirmed", "pending", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (!ObjectId.isValid(id as string)) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = await bookingsCollection.findOne({ _id: new ObjectId(id as string) as any });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Regular users can only cancel their own bookings
    if (req.user!.role !== "admin" && booking.userId !== req.user!.userId) {
      return res.status(403).json({ message: "Forbidden: You cannot modify this booking" });
    }

    // Regular users can only transition to "cancelled"
    if (req.user!.role !== "admin" && status !== "cancelled") {
      return res.status(403).json({ message: "Forbidden: You can only cancel bookings" });
    }

    await updateBookingStatus(id as string, status);

    res.json({ message: `Booking status updated to ${status} successfully` });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ message: "Server error updating booking status" });
  }
};

