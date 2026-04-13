import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/route.js"
import helmet from "helmet";
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
app.use(helmet());
app.use(express.json()); // IMPORTANT
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
}))

app.get("/", (req, res) => {
    res.send("app is up and running!");
});

app.use("/api/", router);

app.listen(port, () => {
    console.log("server is running on http://localhost:5000");
});