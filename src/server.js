import "dotenv/config"
import fileUpload from "express-fileupload"

import express from "express";
import main from "./routers/index.js";
import fs from "fs"
import path from "path"


const app = express();
app.use(express.json());
app.use(fileUpload())


app.use("/", main);


app.use((error, req, res, next) => {
    const status = error.status || 500;

    if (status < 500) {
        return res.status(status).json({ status, message: error.message });
    }

    try {
        const logDir = path.join(process.cwd(), "src", "log");
        const logFilePath = path.join(logDir, "errors.txt");
        const logMessage = `[${new Date().toLocaleString()}] -${req.method} -${req.url} - ${status} - ${error.message}\n${"-".repeat(40)}\n`;
        fs.appendFileSync(logFilePath, logMessage);
    } catch (e) {
        console.error("log yozilmadi:", e.message);
    }
    console.error(error);

    return res.status(500).json({ status: 500, message: "Internal server error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));