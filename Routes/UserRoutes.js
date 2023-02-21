import express from "express";
import {UserInfo,UpdateUserInfo, getUserInfo} from "../controllers/UserController.js";

const router = express.Router();



router.post("/user-info",UserInfo);
router.put("/update-user-info",UpdateUserInfo);
router.get("/user-info",getUserInfo);


export default router;