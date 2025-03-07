import mongoose, { Document } from "mongoose";
import { IProduct } from "./product.model";

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  total: number;
}

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

// Calculate total before saving
cartSchema.pre("save", async function (next) {
  if (!this.isModified("items")) return next();

  await this.populate("items.product");
  this.total = this.items.reduce((sum, item) => {
    return sum + (item.product as any).price * item.quantity;
  }, 0);
  next();
});

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
