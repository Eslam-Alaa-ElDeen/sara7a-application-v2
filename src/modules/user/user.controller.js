import { RoleEnum } from "../../common/enum/user.enum.js";
import { userModel } from "../../DB/model/user.model.js";
import { authentication } from "../../middleware/authentication.middleware.js";
import { authorization } from "../../middleware/authorization.middleware.js";
import {  login, profile, signup } from "./user.service.js";
import { Router } from "express";
import express from "express"
import { Validation } from "../../middleware/validation.middleware.js";
import { loginSchema, signupSchema } from "./user.validation.js";
const router = Router();



router.post("/signup",Validation(signupSchema),signup );

router.post("/login",Validation(loginSchema),login );

router.get("/profile",authentication,authorization([RoleEnum.USER]),profile)
export default router;
