import { Request, Response, NextFunction } from "express";
import { Order } from "../models/order.model";
import { Cart } from "../models/cart.model";
import { Product } from "../models/product.model";
import { AppError } from "../middleware/error.middleware";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return next(new AppError("Cart is empty", 400));
    }

    // Check stock availability and update stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return next(
          new AppError(`Product ${item.product.name} not found`, 404)
        );
      }

      if (product.stock < item.quantity) {
        return next(
          new AppError(`Insufficient stock for ${product.name}`, 400)
        );
      }

      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items: cart.items,
      total: cart.total,
      shippingAddress,
      paymentMethod,
    });

    // Clear cart after order creation
    cart.items = [];
    await cart.save();

    await order.populate("items.product");

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort("-createdAt");

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.product");

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};
