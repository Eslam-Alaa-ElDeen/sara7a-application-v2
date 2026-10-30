import { ALLOW_ORIGINS, port } from "../config/config.service.js";
import { connectionDB } from "./DB/connection.db.js";
import { globalErrorHandling } from "./middleware/index.js";
import {  messageRouter, userRouter } from "./modules/index.js";
import express from "express";
import cors from "cors"
import { connectionRedis } from "./DB/connection.redis.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";



const limiter=rateLimit({
  windowMs:60*1000,
  limit:5,
  message:{
    success:false,
    message:"please try again later u make a lot of requests"
  },
  legacyHeaders:false,
  standardHeaders:true,
  skip:(req)=>{
    return req.path=="/"
  }
});
const app = express();
app.use(limiter)
app.use(helmet())
app.set("case sensitive routing",true)
app.set("strict routing",true)
app.use(cors({
  origin:function(origin,callback){
    if([...ALLOW_ORIGINS,undefined].includes(origin))
      callback(null,true)
    else
      callback(new Error("not allowed by origin"))
  }
}))
app.use(express.json());

await connectionDB()
await connectionRedis()


app.get("/", (req, res) => res.send("Hello World!"));
app.use("/user", userRouter);
app.use("/message",messageRouter)

app.use("{/*dummy}", (req, res) => {
  return res.status(404).json({ message: "Invalid application routing" });
});

app.use(globalErrorHandling);

app.listen(port, () => console.log(`sara7a app listening on port ${port}!`));
