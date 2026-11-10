import { Router } from "express";
import staffController from "../controllers/staff.controller.js";
import validationMiddleware from "../middlewares/validation.js"

import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"


const router = Router();

router
.get("/staff",authGuard,roleGuard("admin"), staffController.getStaff)
.post("/staff", validationMiddleware.staffCreate, staffController.createStaff)
.delete("/staff/:id", authGuard, roleGuard("admin"),staffController.deleteStaff)
.put("/staff/:id",authGuard, roleGuard("admin"),validationMiddleware.staffUpdate, staffController.updateStaff)


export default router;