
import joi from "joi"
import { generalRules } from "../../common/utils/generalRules.js";

export const signupSchema = {
    body: joi.object({
        fName: generalRules.fName.required(),
        lName: generalRules.lName.required(),
        email: generalRules.email.required(),
        password: generalRules.password.required(),
        age: generalRules.age.required(),
        phone: generalRules.phone.required(),
        gender: generalRules.gender.required(),
        role: generalRules.role.required(),
        profileImage: joi.string()
    }).required(),
    
    files: joi.object({
        attachment: joi.array().items(generalRules.file.required()).required().messages({
            "any.required": "file is required"
        }),
        attachments: joi.array().items(generalRules.file.required()).required().messages({
            "any.required": "file is required"
        }),
    }).required()
};


export const loginSchema ={
    body:joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required()
    }).required()
}

export const refreshTokenSchema ={
    headers:generalRules.token.required()
}
export const shareProfileSchema ={
    params:joi.object({
        id:generalRules.id.required()
    }).required()
}
export const updateProfileSchema ={
    body:joi.object({
        fName:generalRules.fName,
        lName:generalRules.lName,
        age:generalRules.age,
        phone:generalRules.phone
    }).required()
}
export const updatePasswordSchema ={
    body:joi.object({
        newPassword:generalRules.password,
        oldPassword:generalRules.password
    }).required()
}
