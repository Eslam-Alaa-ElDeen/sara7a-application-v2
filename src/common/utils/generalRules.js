import joi from "joi";
import { Types } from "mongoose";

export const generalRules = {
  email: joi
    .string()
    .email({ minDomainSegments: 2, maxDomainSegments: 2, tlds: true }),
  password: joi.string(),
  file: joi.object({
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().required(),
    path: joi.string(),
    destination: joi.string(),
    filename: joi.string(),
    size: joi.number().required(),
  }),
  age: joi.number().min(20).max(80).integer().positive(),
  phone: joi.string().length(11),
  gender: joi.string().valid("male", "female"),
  role: joi.string().valid("admin", "user"),
  fName: joi.string().min(2).max(20),
  lName: joi.string(),
  token: joi.object({
    authorization: joi.string().required(),
    "postman-token": joi.string(),
    "content-length": joi.string(),
    host: joi.string(),
    "user-agent": joi.string(),
    accept: joi.string(),
    connection: joi.string(),
    "accept-encoding": joi.string(),
  }),
  id:joi.string().custom((value,helper)=>{
    return Types.ObjectId.isValid(value)?value:helper.message("invalid id")
  })
};
