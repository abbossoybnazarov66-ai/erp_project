import "dotenv/config";
import express from "express";
import main from "./routers/index.js";

const app = express();
app.use(express.json());

// Barcha api'lar uchun umumiy prefix
app.use("/api/v1", main);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));