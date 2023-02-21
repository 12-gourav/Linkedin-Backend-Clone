import express from "express";
import {registerUser,loginUser,loadUser,logout,verify,forgetpassword,resetpassword} from "../controllers/Auth.js";
import { isAuthenticated } from "../Middlewares/isAuthenticated.js";

const router = express.Router();



router.post("/register",registerUser);
router.post("/verify",isAuthenticated,verify)
router.post("/login",loginUser);
router.post("/load",isAuthenticated,loadUser);
router.post("/logout",isAuthenticated,logout);
router.post("/forgetpassword",forgetpassword);
router.put("/resetpassword",resetpassword);


export default router;