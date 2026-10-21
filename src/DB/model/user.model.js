
import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/enum/user.enum.js";

const userSchema=new mongoose.Schema({
    fName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:10,
        trim:true
    },
    lName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:10,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: {
            validator: function(v) {
                return v === v.toLowerCase();
            },
            message: "pls enter a lowerCase email like eslam@gmail.com not ESLAM@gmail.com"
        }
    },
    password:{
        type:String,
        required:function(){
            return this.provider=="system"?true:false
        }
    },
    age:{
        type:Number,
        required:function(){
            return this.provider=="system"?true:false
        }
    },
    gender:{
        type:String,
        enum:Object.values(GenderEnum),
        default:GenderEnum.MALE
    },
    provider:{
        type:String,
        enum:Object.values(ProviderEnum),
        default:ProviderEnum.SYSTEM
    },
    role:{
        type:String,
        enum:Object.values(RoleEnum),
        default:RoleEnum.USER
    },isConfirmed:{
        type:Boolean,
        default:false
    },phone:{
        type:String
    },
    profileImage:{
        type:String
    },
    coverImage:[String],
    changeCredentialAt:{
        type:Date
    }

},{
    timestamps:true,
    strictQuery:true,
    strict:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

export const userModel=mongoose.models.User||mongoose.model("User",userSchema)