"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateQuantity = exports.addToCart = exports.getCart = void 0;
const cart_model_1 = require("../models/cart.model");
const product_model_1 = require("../models/product.model");
const error_middleware_1 = require("../middleware/error.middleware");
const getCart = async (req, res, next) => {
    try {
        let cart = await cart_model_1.Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart) {
            cart = await cart_model_1.Cart.create({
                user: req.user._id,
                items: [],
            });
        }
        res.json(cart);
    }
    catch (error) {
        next(error);
    }
};
exports.getCart = getCart;
const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const product = await product_model_1.Product.findById(productId);
        if (!product) {
            return next(new error_middleware_1.AppError("Product not found", 404));
        }
        if (product.stock < quantity) {
            return next(new error_middleware_1.AppError("Insufficient stock", 400));
        }
        let cart = await cart_model_1.Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await cart_model_1.Cart.create({
                user: req.user._id,
                items: [],
            });
        }
        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
        await cart.populate("items.product");
        res.json(cart);
    }
    catch (error) {
        next(error);
    }
};
exports.addToCart = addToCart;
const updateQuantity = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;
        const product = await product_model_1.Product.findById(productId);
        if (!product) {
            return next(new error_middleware_1.AppError("Product not found", 404));
        }
        if (product.stock < quantity) {
            return next(new error_middleware_1.AppError("Insufficient stock", 400));
        }
        const cart = await cart_model_1.Cart.findOne({ user: req.user._id });
        if (!cart) {
            return next(new error_middleware_1.AppError("Cart not found", 404));
        }
        const item = cart.items.find((item) => item.product.toString() === productId);
        if (!item) {
            return next(new error_middleware_1.AppError("Item not found in cart", 404));
        }
        item.quantity = quantity;
        await cart.save();
        await cart.populate("items.product");
        res.json(cart);
    }
    catch (error) {
        next(error);
    }
};
exports.updateQuantity = updateQuantity;
const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const cart = await cart_model_1.Cart.findOne({ user: req.user._id });
        if (!cart) {
            return next(new error_middleware_1.AppError("Cart not found", 404));
        }
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();
        await cart.populate("items.product");
        res.json(cart);
    }
    catch (error) {
        next(error);
    }
};
exports.removeFromCart = removeFromCart;
const clearCart = async (req, res, next) => {
    try {
        const cart = await cart_model_1.Cart.findOne({ user: req.user._id });
        if (!cart) {
            return next(new error_middleware_1.AppError("Cart not found", 404));
        }
        cart.items = [];
        await cart.save();
        res.json({ message: "Cart cleared successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.clearCart = clearCart;
//# sourceMappingURL=cart.controller.js.map