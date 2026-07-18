import { db } from "../config/db";
import { ObjectId } from "mongodb";

export interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Item {
  _id?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  price: number;
  location: string;
  images: string[];
  rating: number;
  reviews: Review[];
  userId: string;
  userName: string;
  date: string;
  views: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const itemsCollection = db.collection<Item>("items");

export const createItem = async (item: Omit<Item, "_id" | "createdAt" | "updatedAt" | "views" | "reviews">) => {
  const now = new Date();
  const result = await itemsCollection.insertOne({
    ...item,
    views: 0,
    reviews: [],
    createdAt: now,
    updatedAt: now,
  });
  return result;
};

export const findItemById = async (id: string) => {
  if (!ObjectId.isValid(id)) return null;
  return itemsCollection.findOne({ _id: new ObjectId(id) as any });
};

export const deleteItemById = async (id: string) => {
  if (!ObjectId.isValid(id)) return null;
  return itemsCollection.deleteOne({ _id: new ObjectId(id) as any });
};

export const countItems = async (filter: Record<string, any> = {}) => {
  return itemsCollection.countDocuments(filter);
};

export const getItems = async ({
  search,
  category,
  minPrice,
  maxPrice,
  minRating,
  sortBy,
  sortOrder,
  page,
  limit,
}: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  sortOrder?: number;
  page: number;
  limit: number;
}) => {
  const filter: Record<string, any> = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { shortDescription: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  if (minRating !== undefined) {
    filter.rating = { $gte: minRating };
  }

  const sortField = sortBy || "createdAt";
  const sortDir = sortOrder || -1;

  const total = await itemsCollection.countDocuments(filter);
  const items = await itemsCollection
    .find(filter)
    .sort({ [sortField]: sortDir } as any)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getUserItems = async (userId: string) => {
  return itemsCollection.find({ userId }).sort({ createdAt: -1 }).toArray();
};

export const incrementViews = async (id: string) => {
  if (!ObjectId.isValid(id)) return null;
  return itemsCollection.updateOne(
    { _id: new ObjectId(id) as any },
    { $inc: { views: 1 } }
  );
};

export const getCategories = async () => {
  return itemsCollection.distinct("category");
};

export const getItemsByCategory = async (category: string, excludeId?: string, limit = 4) => {
  const filter: Record<string, any> = { category };
  if (excludeId && ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new ObjectId(excludeId) as any };
  }
  return itemsCollection.find(filter).limit(limit).toArray();
};
