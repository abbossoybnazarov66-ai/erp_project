import { Router } from "express";
import staffController from "../controllers/staff.js";
import validationMiddleware from "../middlewares/validation.js"

const router = Router();

router
.get("/staff",staffController.getStaff)

router
.post("/staff",validationMiddleware.staffCreate, staffController.createStaff);

router
.delete("/staff/:id", staffController.deleteStaff);


export default router;