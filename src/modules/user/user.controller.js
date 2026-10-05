import { userModel } from "../../DB/model/user.model.js";
import {  login, signup } from "./user.service.js";
import { Router } from "express";
import express from "express"
const router = Router();



router.post("/signup",signup );

router.post("/login",login );
export default router;
