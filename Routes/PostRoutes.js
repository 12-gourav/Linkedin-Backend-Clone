import express from "express";
import {comment, commentId, CreatePost, CreateVideoPost, DeleteComment, fretchPost, handleQuery, LikePast} from "../controllers/PostController.js";
import {isAuthenticated} from "../Middlewares/isAuthenticated.js";

const router = express.Router();



router.post("/post",CreatePost);
router.post("/post-video",CreateVideoPost);
router.get("/post/:count",fretchPost);
router.post("/post/likes",isAuthenticated,LikePast);
router.post("/post/comment",isAuthenticated,comment);
router.post("/post/comment/delete",isAuthenticated,DeleteComment);
router.post("/post/detail",commentId);
router.post("/search",handleQuery);


export default router;