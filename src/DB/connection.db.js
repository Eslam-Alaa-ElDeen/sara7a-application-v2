import mongoose from "mongoose";

export const connectionDB=async()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/sara7aApp")
        console.log("connection to DB done ");
    } catch (error) {
        console.log("connection to DB failed");
    }
}