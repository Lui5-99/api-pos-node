"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const error_middleware_1 = require("../middleware/error.middleware");
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
        expiresIn: "24h",
    });
};
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return next(new error_middleware_1.AppError("Email already registered", 400));
        }
        const user = await user_model_1.User.create({
            name,
            email,
            password,
        });
        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return next(new error_middleware_1.AppError("Invalid credentials", 401));
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new error_middleware_1.AppError("Invalid credentials", 401));
        }
        const token = generateToken(user._id);
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getCurrentUser = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findById(req.user._id).select("-password");
        if (!user) {
            return next(new error_middleware_1.AppError("User not found", 404));
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=auth.controller.js.map