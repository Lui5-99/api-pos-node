import { Router } from "express";
import {
  getUsers,
  updateUserRole,
  getDashboardStats,
} from "../controllers/admin.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/users", getUsers);
router.put("/users/:userId/role", updateUserRole);
router.get("/dashboard", getDashboardStats);

export default router;
