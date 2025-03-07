"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware);
router.get("/users", admin_controller_1.getUsers);
router.put("/users/:userId/role", admin_controller_1.updateUserRole);
router.get("/dashboard", admin_controller_1.getDashboardStats);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map