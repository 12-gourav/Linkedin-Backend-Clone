import JWT from "jsonwebtoken";
import User from "../models/userModel.js";

///creating middlewares
export const isAuthenticated = async (req,res,next)=>{
try {
    const token = req.headers.token;
    if(!token){
        return res.status(400).json({message:"Login First !!!!!"});
    }
    const decoded = JWT.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    req.token=token;
    req.email=decoded.email;
    req.id=decoded.userId;

    next();
    
} catch (error) {
    res.status(401).json({message:error});
    console.log(error);
}
}
