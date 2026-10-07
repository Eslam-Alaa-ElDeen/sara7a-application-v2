import { port } from "../config/config.service.js";
import { connectionDB } from "./DB/connection.db.js";
import { globalErrorHandling } from "./middleware/index.js";
import {  userRouter } from "./modules/index.js";
import express from "express";
import cors from "cors"

const app = express();
app.use(cors({
  origin:"*"
}))
app.use(express.json());

connectionDB()

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/user", userRouter);

app.use("{/*dummy}", (req, res) => {
  return res.status(404).json({ message: "Invalid application routing" });
});

app.use(globalErrorHandling);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
