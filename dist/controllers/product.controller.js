"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStock = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const product_model_1 = require("../models/product.model");
const error_middleware_1 = require("../middleware/error.middleware");
const getAllProducts = async (req, res, next) => {
    try {
        const { category, search, sort, page = 1, limit = 10 } = req.query;
        const query = {};
        if (category) {
            query.category = category;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }
        const sortOptions = {};
        if (sort) {
            const [field, order] = sort.split(":");
            sortOptions[field] = order === "desc" ? -1 : 1;
        }
        const products = await product_model_1.Product.find(query)
            .sort(sortOptions)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = await product_model_1.Product.countDocuments(query);
        res.json({
            products,
            total,
            pages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res, next) => {
    try {
        const product = await product_model_1.Product.findById(req.params.id);
        if (!product) {
            return next(new error_middleware_1.AppError("Product not found", 404));
        }
        res.json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res, next) => {
    try {
        const product = await product_model_1.Product.create(req.body);
        res.status(201).json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const product = await product_model_1.Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return next(new error_middleware_1.AppError("Product not found", 404));
        }
        res.json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const product = await product_model_1.Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return next(new error_middleware_1.AppError("Product not found", 404));
        }
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
const updateStock = async (req, res, next) => {
    try {
        const { stock } = req.body;
        const product = await product_model_1.Product.findByIdAndUpdate(req.params.id, { stock }, { new: true, runValidators: true });
        if (!product) {
            return next(new error_middleware_1.AppError("Product not found", 404));
        }
        res.json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.updateStock = updateStock;
//# sourceMappingURL=product.controller.js.map