import { Router } from "express";
import lesssonController from "../controllers/lessons.controller.js";
import middleWare from "../middlewares/validation.js"
import {authGuard} from "../guards/auth.guard.js"
import {roleGuard} from "../guards/role.guard.js"

const router = Router();

router
.get("/lessons",authGuard,roleGuard("teacher"),lesssonController.getLessons)
.get("/lessons/:section_id",authGuard,roleGuard("teacher"),lesssonController.getSectionsByUserId)


.post("/lessons",authGuard,roleGuard("teacher") ,middleWare.sectionCreate,lesssonController.createLessons)

.put("/lessons/:id",authGuard,roleGuard("teacher"),lesssonController.updateLessons)
.delete("/lessons/:id",authGuard,roleGuard("teacher"),lesssonController.deleteLessons)



export default router;