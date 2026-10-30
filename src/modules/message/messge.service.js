import { create, deleteMany, deleteOne, find, findById, findOne } from "../../DB/index.js";
import { messageModel } from "../../DB/model/message.model.js";
import { userModel } from "../../DB/model/user.model.js";
import { successResponse } from "../../common/utils/response/index.js";


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
    successResponse({ res, status: 201, data: message })
}


export const getAllMessages=async(req,res,next)=>{
    const messages=await find({
        model:messageModel,
        filter:{
            userId:req.user._id
        }
    })

    if(!messages)
        throw new Error("no messages for this user",{cause:{status:400}})


    successResponse({ res, data: messages })
}


export const getOneMessage=async(req,res,next)=>{
    const message=await findOne({
        model:messageModel,
        filter:{
            _id:req.params.id,
            userId:req.user._id
        }
    })

    if(!message)
        throw new Error("no message for this user",{cause:{status:400}})


    successResponse({ res, data: message })
}

export const deleteOneMessage=async(req,res,next)=>{
    const message=await deleteOne({
        model:messageModel,
        filter:{
            _id:req.params.id,
            userId:req.user._id
        }
    })

    if(!message)
        throw new Error("no message for this user",{cause:{status:400}})

    successResponse({ res, data: { success: true, message } })
}

export const deleteManyMessage=async(req,res,next)=>{
    const messages=await deleteMany({
        model:messageModel,
        filter:{
            userId:req.user._id
        }
    })

    if(!messages)
        throw new Error("no message for this user",{cause:{status:400}})

    successResponse({ res, data: { success: true, messages } })
}


messageModel.deleteMany
