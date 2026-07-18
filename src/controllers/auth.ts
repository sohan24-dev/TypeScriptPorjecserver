import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail, findUserById, countUsers, usersCollection } from "../models/User";
import { signToken } from "../utils/jwt";
import { AuthRequest } from "../middleware/auth";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      // User already exists — update role if provided and re-issue token
      const updatedRole = role || existingUser.role;
      if (role && role !== existingUser.role) {
        await usersCollection.updateOne(
          { _id: existingUser._id },
          { $set: { role: updatedRole, updatedAt: new Date() } }
        );
      }

      const token = await signToken({
        userId: existingUser._id!.toString(),
        email: existingUser.email,
        role: updatedRole,
      });

      return res.status(200).json({
        message: "Token refreshed",
        token,
        user: {
          id: existingUser._id!.toString(),
          name: existingUser.name,
          email: existingUser.email,
          role: updatedRole,
        },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await createUser({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const token = await signToken({
      userId: result.insertedId.toString(),
      email,
      role: role || "user",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: result.insertedId.toString(),
        name,
        email,
        role: role || "user",
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await signToken({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id!.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await findUserById(req.user!.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id!.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await countUsers();
    res.json({ totalUsers });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
