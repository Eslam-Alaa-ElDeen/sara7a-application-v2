import { compare } from "bcrypt";
import { SALT } from "../../../config/config.service.js";
import { Decrypt, Encrypt } from "../../common/security/encryption.security.js";
import { Compare, Hash } from "../../common/security/hash.security.js";
import { create, findOne } from "../../DB/base.repository.js"
import { userModel } from "../../DB/model/user.model.js"

// import { users } from '../../DB/model/index.js'
export const signup = async(req, res, next) => {
    try {
        const {fName,lName,email,password,phone,gender,DOB,age}=req.body;
        console.log({fName,lName,email,password,phone,gender,DOB,age});

      const ExistUser=await findOne({model:userModel,filter:{email:email}})

      if (ExistUser) {
        throw new Error("email already exist",{cause:{status:407}})
      }
      const data=await create({
        model:userModel,
        data:{
        fName,lName,
        email,
        password:await Hash(password,SALT)
        ,phone:await Encrypt(phone)
        ,gender,DOB,age}

      })
      res.status(200).json({data})
    } catch (error) {
      res.status(404).json({msg:error.message})
    }
}


export const login=async(req, res, next) => {
    try {
      const {email,password}=req.body;
      console.log( {email,password});
      const ExistUser=await findOne({model:userModel,filter:{email:email}})

      if (!ExistUser) {
        throw new Error("email not exist",{cause:{status:404}})
      }
      let passwordCheck=Compare(password,ExistUser.password)
      if(!passwordCheck)
        throw new Error("password not matched",{cause:{status:404}})
    
      ExistUser.phone=await Decrypt(ExistUser.phone)
      res.status(200).json({ExistUser})
    } catch (error) {
      res.status(404).json({msg:error.message})
    }
}