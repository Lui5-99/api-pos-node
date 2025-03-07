"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
        },
    ],
    total: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
cartSchema.pre("save", async function (next) {
    if (!this.isModified("items"))
        return next();
    await this.populate("items.product");
    this.total = this.items.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
    }, 0);
    next();
});
exports.Cart = mongoose_1.default.model("Cart", cartSchema);
//# sourceMappingURL=cart.model.js.map