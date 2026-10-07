import { compare } from "bcrypt";
import { KEY_ACCESS, KEY_REFRESH, SALT } from "../../../config/config.service.js";
import { Decrypt, Encrypt } from "../../common/security/encryption.security.js";
import { Compare, Hash } from "../../common/security/hash.security.js";
import { create, findOne } from "../../DB/base.repository.js"
import { userModel } from "../../DB/model/user.model.js"
import jwt from 'jsonwebtoken'
import joi from "joi"
import {OAuth2Client} from 'google-auth-library';
const client=new OAuth2Client();

// import { users } from '../../DB/model/index.js'
export const signup = async(req, res, next) => {
    try {


        const {fName,lName,email,password,phone,gender,DOB,age}=req.body;

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
export const signupWithGmail = async(req, res, next) => {
    try {
      const{idToken}=req.body;

      const ticket = await client.verifyIdToken({
          idToken,
          audience:"867768865965-l6sk69spvkgncdj1ni3oc3tphi8nk00b.apps.googleusercontent.com",
      });
      const {family_name,given_name,email,email_verified,picture} = ticket.getPayload();

      let user=await findOne({
        model:userModel,
        filter:{email:email.toLowerCase()}
      })

      if(!user){
        user=await create({
            model:userModel,
            data:{
              fName:given_name,
              lName:family_name,
              email,
              profileImage:picture,
              isConfirmed:email_verified,
              provider:"google"
            }
          })
        }
        if(user.provider=="system")
          throw new Error("pls login with system",{cause:{status:400}})
      
      const access_token=jwt.sign({
        id:user._id
      },KEY_ACCESS,{
        expiresIn:300,
        issuer:"https://localhost:3000"
      })

      const refresh_token=jwt.sign({
        id:user._id
      },KEY_REFRESH,{
        expiresIn:300,
        issuer:"https://localhost:3000"
      })

      res.status(200).json({message:"done",access_token,refresh_token})

    } catch (error) {
      res.status(404).json({msg:error.message})
    }
}


export const login=async(req, res, next) => {
    try {
      const {email,password}=req.body;
      const ExistUser=await findOne({model:userModel,filter:{email:email}})

      if (!ExistUser) {
        throw new Error("email not exist",{cause:{status:404}})
      }
      let passwordCheck=Compare(password,ExistUser.password)
      if(!passwordCheck)
        throw new Error("password not matched",{cause:{status:404}})
    
      ExistUser.phone=await Decrypt(ExistUser.phone)

      const access_token=jwt.sign({
        id:ExistUser._id
      },KEY_ACCESS,{
        expiresIn:300,
        issuer:"https://localhost:3000"
      })

      const refresh_token=jwt.sign({
        id:ExistUser._id
      },KEY_REFRESH,{
        expiresIn:300,
        issuer:"https://localhost:3000"
      })
      res.status(200).json({tokens:{access_token,refresh_token}})
    } catch (error) {
      res.status(404).json({msg:error.message})
    }
}

export const profile=async(req,res,next)=>{
  

  res.status(200).json({user:req.user})
}