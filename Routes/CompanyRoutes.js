import express from "express";
import { CreateCompany, createNews, fetchNews, getCompany } from "../controllers/CreateCompany.js";

import {isAuthenticated} from "../Middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/create-company",isAuthenticated,CreateCompany);
router.post("/get/company",getCompany);
router.post("/news",createNews);
router.get("/news",fetchNews);


export default router;