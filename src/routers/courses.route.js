import { Router } from "express";
import courseController from "../controllers/course.controller.js";
import middleWare from "../middlewares/validation.js"
import {authGuard} from "../guards/auth.guard.js"
import {roleGuard} from "../guards/role.guard.js"

const router = Router();

router
.get("/course",authGuard,roleGuard("admin","teacher"),courseController.getCourses)

.post("/course",authGuard,roleGuard("teacher"),middleWare.courseCreate,courseController.createCourses)

.delete("/course/:id", authGuard, roleGuard("admin", "teacher"), courseController.deleteCourses)
.put("/course/:id", authGuard, roleGuard("admin", "teacher"), courseController.updateCourses)




export default router;