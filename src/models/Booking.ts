import { db } from "../config/db";
import { ObjectId } from "mongodb";

export interface Booking {
  _id?: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyLocation: string;
  userId: string;
  userName: string;
  userEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export const bookingsCollection = db.collection<Booking>("bookings");

export const createBooking = async (
  booking: Omit<Booking, "_id" | "createdAt" | "updatedAt">
) => {
  const now = new Date();
  const result = await bookingsCollection.insertOne({
    ...booking,
    createdAt: now,
    updatedAt: now,
  });
  return result;
};

export const getUserBookings = async (userId: string) => {
  return bookingsCollection
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
};

export const getAllBookings = async (page = 1, limit = 20) => {
  const [total, bookings] = await Promise.all([
    bookingsCollection.countDocuments(),
    bookingsCollection
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
  ]);
  return { bookings, total, page, totalPages: Math.ceil(total / limit) };
};

export const countBookings = async () => {
  return bookingsCollection.countDocuments();
};

export const getBookingStats = async (userId?: string) => {
  const matchFilter: Record<string, any> = {};
  if (userId) {
    matchFilter.userId = userId;
  }

  const [totalBookings, confirmedBookings, totalRevenue] = await Promise.all([
    bookingsCollection.countDocuments(matchFilter),
    bookingsCollection.countDocuments({
      ...matchFilter,
      status: "confirmed",
    }),
    bookingsCollection
      .aggregate([
        { $match: { status: "confirmed", ...(userId ? { userId } : {}) } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ])
      .toArray(),
  ]);

  return {
    totalBookings,
    confirmedBookings,
    totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
  };
};

export const updateBookingStatus = async (
  id: string,
  status: "confirmed" | "pending" | "cancelled"
) => {
  if (!ObjectId.isValid(id)) return null;
  return bookingsCollection.updateOne(
    { _id: new ObjectId(id) as any },
    { $set: { status, updatedAt: new Date() } }
  );
};

