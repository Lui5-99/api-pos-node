"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const authMiddleware = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
        const user = await user_model_1.User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        return next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = async (_req, res, next) => {
    try {
        if (_req.user.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }
        return next();
    }
    catch (error) {
        return res.status(403).json({ message: "Access denied" });
    }
};
exports.adminMiddleware = adminMiddleware;
//# sourceMappingURL=auth.middleware.js.map