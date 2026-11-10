import { Router } from "express";
import teacherController from "../controllers/teacher.controller.js";

const router = Router();

router
.get("/teacher", teacherController.getTeacher)

.post("/teacher", teacherController.createTeacher)

.delete("/teacher/:id",teacherController.deleteTeacher)

.put("/teacher/:id",teacherController.updateTeacher)





export default router;