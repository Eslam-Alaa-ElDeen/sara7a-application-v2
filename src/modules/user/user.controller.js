import { RoleEnum } from "../../common/enum/user.enum.js";
import { userModel } from "../../DB/model/user.model.js";
import { authentication } from "../../middleware/authentication.middleware.js";
import { authorization } from "../../middleware/authorization.middleware.js";
import {  login, logout, profile, refreshToken, shareProfile, signup, signupWithGmail, updatePassword, updateProfile } from "./user.service.js";
import { Router } from "express";
import express from "express"
import { Validation } from "../../middleware/validation.middleware.js";
import { loginSchema, refreshTokenSchema, shareProfileSchema, signupSchema, updatePasswordSchema, updateProfileSchema } from "./user.validation.js";
import { multerLocal } from "../../middleware/multer.middleware.js";
const router = Router();



router.post("/signup",multerLocal({customPath:"admin/3mk_eslam",customTypes:["image/png","image/jpg","image.jpg","image/jpeg"]}).fields([
    {name:"attachment",max:1},
    {name:"attachments",max:6}
]),Validation(signupSchema),signup );

router.post("/signup/gmail",signupWithGmail );

router.post("/refresh-token",Validation(refreshTokenSchema),refreshToken );

router.post("/login",Validation(loginSchema),login );

router.get("/profile",authentication,authorization([RoleEnum.USER]),profile)
router.get("/share-profile/:id",Validation(shareProfileSchema),shareProfile)

router.patch("/update-profile",Validation(updateProfileSchema),authentication,updateProfile)
router.patch("/update-password",Validation(updatePasswordSchema),authentication,updatePassword)
router.patch("/logout",authentication,logout)
export default router;
