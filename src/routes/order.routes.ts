import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
} from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);

export default router;
