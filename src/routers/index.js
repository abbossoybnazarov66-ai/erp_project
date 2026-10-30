import { Router } from "express";
import staffRouter from "./staff.js";

const main = Router();

// Staff router'ni ulaymiz
main.use("/staff", staffRouter);

export default main;