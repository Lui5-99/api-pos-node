"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.getOrders = exports.createOrder = void 0;
const order_model_1 = require("../models/order.model");
const cart_model_1 = require("../models/cart.model");
const product_model_1 = require("../models/product.model");
const error_middleware_1 = require("../middleware/error.middleware");
const createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const cart = await cart_model_1.Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return next(new error_middleware_1.AppError("Cart is empty", 400));
        }
        for (const item of cart.items) {
            const product = await product_model_1.Product.findById(item.product._id);
            if (!product) {
                return next(new error_middleware_1.AppError(`Product ${item.product.name} not found`, 404));
            }
            if (product.stock < item.quantity) {
                return next(new error_middleware_1.AppError(`Insufficient stock for ${product.name}`, 400));
            }
            product.stock -= item.quantity;
            await product.save();
        }
        const order = await order_model_1.Order.create({
            user: req.user._id,
            items: cart.items,
            total: cart.total,
            shippingAddress,
            paymentMethod,
        });
        cart.items = [];
        await cart.save();
        await order.populate("items.product");
        res.status(201).json(order);
    }
    catch (error) {
        next(error);
    }
};
exports.createOrder = createOrder;
const getOrders = async (req, res, next) => {
    try {
        const orders = await order_model_1.Order.find({ user: req.user._id })
            .populate("items.product")
            .sort("-createdAt");
        res.json(orders);
    }
    catch (error) {
        next(error);
    }
};
exports.getOrders = getOrders;
const getOrderById = async (req, res, next) => {
    try {
        const order = await order_model_1.Order.findOne({
            _id: req.params.id,
            user: req.user._id,
        }).populate("items.product");
        if (!order) {
            return next(new error_middleware_1.AppError("Order not found", 404));
        }
        res.json(order);
    }
    catch (error) {
        next(error);
    }
};
exports.getOrderById = getOrderById;
//# sourceMappingURL=order.controller.js.map