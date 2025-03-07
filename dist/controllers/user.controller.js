"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.changePassword = exports.updateProfile = exports.getProfile = void 0;
const user_model_1 = require("../models/user.model");
const error_middleware_1 = require("../middleware/error.middleware");
const getProfile = async (req, res, next) => {
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
exports.getProfile = getProfile;
const updateProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const userId = req.user._id;
        const existingUser = await user_model_1.User.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            return next(new error_middleware_1.AppError("Email already in use", 400));
        }
        const user = await user_model_1.User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true }).select("-password");
        if (!user) {
            return next(new error_middleware_1.AppError("User not found", 404));
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await user_model_1.User.findById(req.user._id);
        if (!user) {
            return next(new error_middleware_1.AppError("User not found", 404));
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return next(new error_middleware_1.AppError("Current password is incorrect", 400));
        }
        user.password = newPassword;
        await user.save();
        res.json({ message: "Password updated successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.changePassword = changePassword;
const deleteAccount = async (req, res, next) => {
    try {
        const { password } = req.body;
        const user = await user_model_1.User.findById(req.user._id);
        if (!user) {
            return next(new error_middleware_1.AppError("User not found", 404));
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new error_middleware_1.AppError("Password is incorrect", 400));
        }
        await user_model_1.User.findByIdAndDelete(req.user._id);
        res.json({ message: "Account deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAccount = deleteAccount;
//# sourceMappingURL=user.controller.js.map