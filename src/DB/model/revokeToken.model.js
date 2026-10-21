import mongoose from "mongoose";


const revokeTokenSchema=new mongoose.Schema({
    tokenId:{
        type:String,
        required:true,
        trim:true,
    },

    expireAt:Date,

    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    }

},{
    timeseries:true,
    strict:true,
    strictQuery:true
})

// once field expireAt fill remove the document
revokeTokenSchema.index({expireAt:1},{expireAfterSeconds:0})


const revokeTokenModel=mongoose.models.revokeToken || mongoose.model("revokeToken",revokeTokenSchema)

export default revokeTokenModel;