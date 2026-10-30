import { Router } from "express";
import staffController from "../controllers/staff.js";

const router = Router();


router.post("/", staffController.createStaff);

export default router;