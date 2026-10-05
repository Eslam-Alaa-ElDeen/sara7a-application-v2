
import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    fName:{
        type:String,
        required:true,
        minLength:2,
        maxLenght:10,
        trim:true
    },
    lName:{
        type:String,
        required:true,
        minLength:2,
        maxLenght:10,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        enum:["male","female"],
        default:"male"
    },
    provider:{
        type:String,
        enum:["google","system"],
        default:"system"
    },isCongirmed:{
        type:Boolean,
        default:false
    },phone:{
        type:String
    }

},{
    timestamps:true,
    strictQuery:true,
    strict:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

export const userModel=mongoose.models.User||mongoose.model("User",userSchema)