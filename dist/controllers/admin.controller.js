"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.updateUserRole = exports.getUsers = void 0;
const user_model_1 = require("../models/user.model");
const order_model_1 = require("../models/order.model");
const product_model_1 = require("../models/product.model");
const error_middleware_1 = require("../middleware/error.middleware");
const getUsers = async (_req, res, next) => {
    try {
        const users = await user_model_1.User.find().select("-password");
        res.json(users);
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        const { userId } = req.params;
        if (!["user", "admin"].includes(role)) {
            return next(new error_middleware_1.AppError("Invalid role", 400));
        }
        const user = await user_model_1.User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
        if (!user) {
            return next(new error_middleware_1.AppError("User not found", 404));
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserRole = updateUserRole;
const getDashboardStats = async (_req, res, next) => {
    var _a;
    try {
        const [totalUsers, totalProducts, totalOrders, recentOrders, lowStockProducts,] = await Promise.all([
            user_model_1.User.countDocuments(),
            product_model_1.Product.countDocuments(),
            order_model_1.Order.countDocuments(),
            order_model_1.Order.find().populate("user", "name email").sort("-createdAt").limit(5),
            product_model_1.Product.find({ stock: { $lt: 10 } })
                .select("name stock")
                .sort("stock")
                .limit(5),
        ]);
        const totalRevenue = await order_model_1.Order.aggregate([
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
            totalRevenue: ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
            recentOrders,
            lowStockProducts,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=admin.controller.js.map