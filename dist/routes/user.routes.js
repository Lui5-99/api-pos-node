"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get("/profile", user_controller_1.getProfile);
router.put("/profile", user_controller_1.updateProfile);
router.put("/password", user_controller_1.changePassword);
router.delete("/account", user_controller_1.deleteAccount);
exports.default = router;
//# sourceMappingURL=user.routes.js.map