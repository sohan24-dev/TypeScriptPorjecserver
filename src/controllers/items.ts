import { Request, Response } from "express";
import {
  createItem,
  getItems,
  findItemById,
  deleteItemById,
  getUserItems,
  incrementViews,
  getCategories,
  getItemsByCategory,
  countItems,
} from "../models/Item";
import { AuthRequest } from "../middleware/auth";
import { findUserById } from "../models/User";

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      sortBy,
      sortOrder,
      page = "1",
      limit = "12",
    } = req.query;

    const result = await getItems({
      search: search as string | undefined,
      category: category as string | undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      sortBy: sortBy as string | undefined,
      sortOrder: sortOrder ? Number(sortOrder) : undefined,
      page: Number(page),
      limit: Number(limit),
    });

    res.json(result);
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({ message: "Server error fetching items" });
  }
};

export const getSingleItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const item = await findItemById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Increment view count
    await incrementViews(id);

    // Get related items
    const relatedItems = await getItemsByCategory(item.category, id, 4);

    res.json({
      item: { ...item, _id: item._id!.toString() },
      relatedItems: relatedItems.map((r) => ({ ...r, _id: r._id!.toString() })),
    });
  } catch (error) {
    console.error("Get item error:", error);
    res.status(500).json({ message: "Server error fetching item" });
  }
};

export const addItem = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      shortDescription,
      fullDescription,
      category,
      price,
      location,
      images,
      rating,
      date,
      featured,
    } = req.body;

    if (!title || !shortDescription || !category || !price) {
      return res.status(400).json({
        message: "Title, short description, category, and price are required",
      });
    }

    const user = await findUserById(req.user!.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await createItem({
      title,
      shortDescription,
      fullDescription: fullDescription || "",
      category,
      price: Number(price),
      location: location || "",
      images: images || [],
      rating: rating ? Number(rating) : 0,
      userId: req.user!.userId,
      userName: user.name,
      date: date || new Date().toISOString().split("T")[0],
      featured: featured || false,
    });

    res.status(201).json({
      message: "Item created successfully",
      itemId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Create item error:", error);
    res.status(500).json({ message: "Server error creating item" });
  }
};

export const removeItem = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const item = await findItemById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check ownership
    if (item.userId !== req.user!.userId && req.user!.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await deleteItemById(id);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({ message: "Server error deleting item" });
  }
};

export const getMyItems = async (req: AuthRequest, res: Response) => {
  try {
    const items = await getUserItems(req.user!.userId);
    const itemsWithStringIds = items.map((item) => ({
      ...item,
      _id: item._id!.toString(),
    }));
    res.json({ items: itemsWithStringIds });
  } catch (error) {
    console.error("Get my items error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getCategories();
    res.json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const totalItems = await countItems();
    const categories = await getCategories();
    const totalViews = await getItems({ page: 1, limit: 1 }).then(
      () => 0 // placeholder - we don't have aggregated views
    );

    res.json({
      totalItems,
      totalCategories: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
