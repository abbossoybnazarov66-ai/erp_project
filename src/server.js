import "dotenv/config"

import express from "express";
import main from "./routers/index.js";
import fs from "fs"
import path from "path"


const app = express();
app.use(express.json());

// Barcha api'lar uchun umumiy prefix
app.use("/", main);


app.use((error, req, res, next) => {
    if (error.status <= 500) {

        res.status(error.status).json({
            status : error.status,
            message : error.message
        })
    }
    else{
        const logDir = path.join(process.cwd(), "src", "log");
        const logFilePath = path.join(logDir, "errors.txt");

        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        const logMessage = `[${new Date().toLocaleDateString()}] - ${error.status} - ${error.message}\n-----------------------------------\n`

       fs.appendFileSync(logFilePath, logMessage);


       return res.status(error.status).json({
            status: error.status,
            message: error.message || "Internal Server Error"
       })
    }

}

)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));