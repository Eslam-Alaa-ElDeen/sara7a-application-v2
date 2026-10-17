
import joi from "joi"

export const signupSchema ={
    body:joi.object({
        fName: joi.string().required().min(2).max(20),
        lName: joi.string().required(),
        email: joi.string().required().email({minDomainSegments:2,maxDomainSegments:2,tlds:true}),
        password: joi.string().required(),
        age:joi.number().min(20).max(80).integer().positive().required(),
        phone:joi.string().length(11).required(),
        gender:joi.string().required().valid('male','female'),
        role:joi.string().required().valid('admin','user'),
        profileImage:joi.string()
    }).required(),
    query:joi.object({
        flag: joi.boolean().falsy(0,"no","nan","not","-1","n").truthy(1,"yes","y","ok","done").sensitive()
    })
}


export const loginSchema ={
    body:joi.object({
        email: joi.string().required().email({minDomainSegments:2,maxDomainSegments:2,tlds:true}),
        password: joi.string().required(),
    }).required(),
}
