import mongoose from "mongoose";


const messageSchema=mongoose.Schema({
    content:{
        type:String,
        required:function(){
            return this.attachments?.length?false:true
        },
        trim:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    attachments:[String]
    
},{
    timestamps:true,
    strictQuery:true,
    strict:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

export const messageModel=mongoose.models.Message || mongoose.model("Message",messageSchema);
