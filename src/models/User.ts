import { db } from "../config/db";
import { ObjectId } from "mongodb";

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export const usersCollection = db.collection<User>("users");

export const createUser = async (user: Omit<User, "_id" | "createdAt" | "updatedAt">) => {
  const now = new Date();
  const result = await usersCollection.insertOne({
    ...user,
    createdAt: now,
    updatedAt: now,
  });
  return result;
};

export const findUserByEmail = async (email: string) => {
  return usersCollection.findOne({ email });
};

export const findUserById = async (id: string) => {
  if (!ObjectId.isValid(id)) return null;
  return usersCollection.findOne({ _id: new ObjectId(id) as any });
};

export const countUsers = async () => {
  return usersCollection.countDocuments();
};

export const getAllUsers = async (page = 1, limit = 50) => {
  const [total, users] = await Promise.all([
    usersCollection.countDocuments(),
    usersCollection
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
  ]);
  return { users, total, page, totalPages: Math.ceil(total / limit) };
};
