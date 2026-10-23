import { EventEmitter } from "node:events";

export const eventEmitter=new EventEmitter();

eventEmitter.on("confirm_email",async(f)=>{
    await f();
})