import { create, findById } from "../../DB/index.js";
import { messageModel } from "../../DB/model/message.model.js";
import { userModel } from "../../DB/model/user.model.js";


export const createMessage=async(req,res,next)=>{
    const {content,userId}=req.body;

    if(content==undefined && req?.files?.attachments==undefined){
        throw new Error("you must send at least content or attachments",{cause:{status:400}})
    }

    const user=await findById({
        model:userModel,
        ID:userId
    })

    if(!user)
        throw new Error("user not exist please enter a valid ID for user",{cause:{status:400}})

    let attachments=[];
    if(req?.files?.attachments)
        attachments = req.files?.attachments.map(file => file.path) || [];
    
    const message=await create({
        model:messageModel,
        data:{
            userId,
            content,
            attachments
        }
    })
    res.status(201).json({
        message
    })
}