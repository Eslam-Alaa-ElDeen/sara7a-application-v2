import nodemailer from "nodemailer";
import{randomInt}from "node:crypto"
import { EMAIL_PASS } from "../../../config/config.service.js";

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"ea33669900@gmail.com",
        pass:EMAIL_PASS
    }
})

export const sendEmail = async ({
    to,
    subject,
    html,
    attachments = []
}) => {
    const info = await transporter.sendMail({
        from: `"sara7a app" <ea33669900@gmail.com>`,
        to,
        subject,
        html,
        attachments
    })
    return info.accepted.length>0?true:false;
}

export const createOTP=()=>{
    return randomInt(100000,1000000).toString()
}