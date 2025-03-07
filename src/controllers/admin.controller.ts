import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { AppError } from "../middleware/error.middleware";

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role } = req.body;
    const { userId } = req.params;

    if (!["user", "admin"].includes(role)) {
      return next(new AppError("Invalid role", 400));
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find().populate("user", "name email").sort("-createdAt").limit(5),
      Product.find({ stock: { $lt: 10 } })
        .select("name stock")
        .sort("stock")
        .limit(5),
    ]);

    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    next(error);
  }
};
