"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const auth_middleware_1 = require("./middleware/auth.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/cart", auth_middleware_1.authMiddleware, cart_routes_1.default);
app.use("/api/orders", auth_middleware_1.authMiddleware, order_routes_1.default);
app.use("/api/admin", auth_middleware_1.authMiddleware, admin_routes_1.default);
app.use("/api/user", auth_middleware_1.authMiddleware, user_routes_1.default);
app.use(error_middleware_1.errorHandler);
mongoose_1.default
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pos-system")
    .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error("MongoDB connection error:", error);
});
//# sourceMappingURL=index.js.map