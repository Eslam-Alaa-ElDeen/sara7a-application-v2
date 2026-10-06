import jwt from "jsonwebtoken"
import { findById, findOne } from "../DB/base.repository.js"
import { userModel } from "../DB/model/user.model.js"
import { KEY_ACCESS } from "../../config/config.service.js"



export const authentication=async(req,res,next)=>{
    const {authorization}=req.headers


    if(!authorization)
        throw new Error("token not exist",{cause:{status:404}})

    const decodedToken=await jwt.verify(authorization,KEY_ACCESS)

    if(!decodedToken?.id)
        throw new Error("id not exist on token",{cause:{status:400}})

    const user=await findById({
        model:userModel,
        ID:decodedToken.id
    })

    if(!user)
        throw new Error("user not exist",{cause:{status:404}})

    req.user=user;
    next()
    
}