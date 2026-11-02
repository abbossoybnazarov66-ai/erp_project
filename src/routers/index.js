import { Router } from "express";
import staffRouter from "./staff.js";

const main = Router();

// Staff router'ni ulaymiz
main.use("/api/v1", staffRouter);



export default main;