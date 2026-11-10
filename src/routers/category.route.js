import { Router } from "express";
import categoryController from "../controllers/category.controller.js";
import middleWare from "../middlewares/validation.js"
import {authGuard} from "../guards/auth.guard.js"
import {roleGuard} from "../guards/role.guard.js"

const router = Router();

router
.get("/category",authGuard,roleGuard("admin"),categoryController.getCategories)

.post("/category",authGuard,roleGuard("admin"),middleWare.categoryCreate,categoryController.createCategories)

.delete("/category/:id",authGuard,roleGuard("admin"),categoryController.deleteCategories)

.put("/category/:id",authGuard,roleGuard("admin"),categoryController.updateCategories)


export default router;