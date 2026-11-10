import { Router } from "express";
import studentController from "../controllers/studens.controller.js";
import middleWare from "../middlewares/validation.js"
import { authGuard } from "../guards/auth.guard.js";
import { roleGuard } from "../guards/role.guard.js";

const router = Router();

router
.get("/students",authGuard,roleGuard("admin"), studentController.getStudent)

.post("/students",authGuard,roleGuard("admin"),middleWare.studentCreate,studentController.createStudent)

.delete("/students/:id",authGuard,roleGuard("admin"),studentController.deleteStudent)

.put("/students/:id",authGuard,roleGuard("admin"),studentController.updateStudent)


export default router;