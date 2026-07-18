import { Router } from "express";
import {
  getAllItems,
  getSingleItem,
  addItem,
  removeItem,
  getMyItems,
  getAllCategories,
  getStats,
} from "../controllers/items";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", getAllItems);
router.get("/categories", getAllCategories);
router.get("/stats", getStats);
router.get("/my-items", authMiddleware, getMyItems);
router.get("/:id", getSingleItem);
router.post("/", authMiddleware, addItem);
router.delete("/:id", authMiddleware, removeItem);

export default router;
