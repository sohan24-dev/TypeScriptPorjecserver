import { Response } from "express";
import { getAllBookings, getBookingStats } from "../models/Booking";
import { countUsers, getAllUsers } from "../models/User";
import { countItems } from "../models/Item";
import { AuthRequest } from "../middleware/auth";

export const getAdminDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const [bookingStats, totalUsers, totalItems] = await Promise.all([
      getBookingStats(),
      countUsers(),
      countItems(),
    ]);

    res.json({
      totalBookings: bookingStats.totalBookings,
      confirmedBookings: bookingStats.confirmedBookings,
      totalRevenue: bookingStats.totalRevenue,
      totalUsers,
      totalItems,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: "Server error fetching admin stats" });
  }
};

export const getAllBookingsPaginated = async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllBookings(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20
    );
    const bookingsWithStringIds = result.bookings.map((b) => ({
      ...b,
      _id: b._id!.toString(),
    }));
    res.json({
      bookings: bookingsWithStringIds,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error("Admin get all bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsersList = async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit } = req.query;
    const users = await getAllUsers(
      page ? Number(page) : 1,
      limit ? Number(limit) : 50
    );
    const usersWithStringIds = users.users.map((u) => ({
      id: u._id!.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }));
    res.json({
      users: usersWithStringIds,
      total: users.total,
      page: users.page,
      totalPages: users.totalPages,
    });
  } catch (error) {
    console.error("Admin get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
