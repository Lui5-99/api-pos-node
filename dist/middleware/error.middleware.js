"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.AppError = AppError;
const errorHandler = (_err, _req, res, _next) => {
    if (_err instanceof AppError) {
        return res.status(_err.statusCode).json({
            status: _err.status,
            message: _err.message,
        });
    }
    console.error("Error:", _err);
    return res.status(500).json({
        status: "error",
        message: "Something went wrong!",
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map