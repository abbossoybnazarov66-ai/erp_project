import { Router } from "express"
import mentorControllers from "../controllers/mentor.controller.js"
import validationMiddleware from "../middlewares/validation.js"
import { roleGuard } from "../guards/role.guard.js"
import { authGuard } from "../guards/auth.guard.js"

const router = Router()

router.
get("/mentors",authGuard,roleGuard("admin"),mentorControllers.getMentors)
.post("/mentors",validationMiddleware.mentorSchema,mentorControllers.createMentors)
.delete("/mentors/:id",mentorControllers.deleteMentors)
.put("/mentors/:id",mentorControllers.updeteMentors)


export default router