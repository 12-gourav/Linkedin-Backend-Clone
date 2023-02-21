import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import Jwt  from "jsonwebtoken";
import { sendMails } from "../utills/sendMail.js";


export const registerUser = async (req,res)=>{
    try {
     const {name,email,password} = req.body;
     console.log(name,email,password);
     //we store user email in lowercase---->

     const existUser = await User.findOne({email:email.toLowerCase()});
     if(existUser){
        return res.status(400).json({message:"User already exist"});
     }
         ///we encrypt user password----->
    const encryptPassword = await bcrypt.hash(password,10);

///generate OTP
const otp = Math.floor(Math.random() * 1000000);


   ///insert data
    const user = await User.create({name:name,email:email.toLowerCase(),password:encryptPassword,otp
        ,otp_expiary:new Date(Date.now()+5*60*1000)});

    await sendMails(email,"Verify your account",`Your OTP is ${otp}`);

    // now generate JWT Token
        if(user){
       const token = Jwt.sign({userId:user._id,email:user.email},
       process.env.JWT_SECRET,{expiresIn:"24h"})


       res.status(201).json({message:"User Register SuccessFully :)",data:user,token:token,sos:"OTP sent to your Account,Please Verify your account"})

         }

        
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }
}



// verify routes

export const verify = async (req,res)=>{
    try {
        const otp = Number(req.body.otp);
        const user = await User.findById(req.user._id);

        if(user.otp !== otp || user.otp_expiary < Date.now()){
            return res.status(400).json({success:false,message:"Invalid OTP "});
        }
user.verified = true;
user.otp = null;
user.otp_expiary = null;
await user.save();

// now generate JWT Token
if(user){
    const token = Jwt.sign({userId:user._id,email:user.email},
    process.env.JWT_SECRET,{expiresIn:"24h"})


    res.status(201).json({message:"User Register SuccessFully :)",data:user,token:token,sos:"OTP sent to your Account,Please Verify your account"})

      }



    } catch (error) {
         console.log(error);
    res.status(500).json({success:false,message:error.message});
    }

}

/////login User


export const loginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;
        console.log(email,password);
        
         const userExist = await User.findOne({email:email.toLowerCase()});
          if(!userExist) return res.status(400).json({error:"User Does Not exist"});

          const check = await bcrypt.compare(password,userExist.password);
          console.log(check);
          if(!check){
        return res.status(400).json({error:"Invalid Credintials..."});
          }

       /// everthing is ok
       /// created jsonwebToken......
       const token = Jwt.sign({
        userId:userExist._id,
          email:userExist.email
        },process.env.JWT_SECRET,{
        expiresIn:"24h"
       });

       return res.status(200).json({message:"Login successFully",data:userExist,token:token});

        }

     catch (error) {
        return res.status(400).json({message:error});
    }
}


////load user

export const loadUser = async (req,res)=>{
    try {
      
          const data = await User.findOne({email:req.email});
            if(data){
                return res.status(200).json({data:data,token:req.token});
                }
        
        return res.status(400).json({error:"Unauthorized User"});
        
    } catch (error) {
        return res.status(400).json({error:error});
    }
}

////logout

export const logout = async(req,res)=>{
    try {
        res.status(200).json({success:true,message:"Logout Successfully"});
 
         
     } catch (error) {
         console.log(error);
         res.status(500).json({success:false,message:error.message});
     }
}


//ForgetPassword

export const forgetpassword = async (req,res)=>{
    try {
     const {email} = req.body;
     if(!email){
         return res.status(400).json({success:false,message:"Invalid Email"});
     }
     const user = await User.findOne({email});
     if(!user){
         return res.status(400).json({success:false,message:"User Does not Exists"});
     }
     const otp = Math.floor(Math.random() * 1000000);
     user.resetPasswordOtp = otp;
     user.resetPasswordOtpExpiary = Date.now() + 10 * 60 * 1000; //1hr
 
     await user.save();
 
     await sendMails(email,"Request To Reset password",`Your OTP is ${otp}`);
     
     res.status(200).json({success:true,message:`OTP sent to ${email}`});
 
     
    } catch (error) {
     console.log(error);
     res.status(500).json({success:false,message:error.message});
    }
 
 }
 //ResetPassword
 
 export const resetpassword = async (req,res)=>{
     try {
      const {otp,newPassword} = req.body;
      if(!otp){
          return res.status(400).json({success:false,message:"plz enter Valid Otp"});
      }
      const user = await User.findOne({resetPasswordOtp:otp,resetPasswordOtpExpiary:{$gt:Date.now()}});
 
      if(!user){
          return res.status(400).json({success:false,message:"OTP has been Expired"});
      }
     
      user.resetPasswordOtp = null;
      user.resetPasswordOtpExpiary = null;//1hr
      user.password = newPassword;
  
      await user.save();
  
      
      
      res.status(200).json({success:true,message:"Password Update successfully"});
  
      
     } catch (error) {
      console.log(error);
      res.status(500).json({success:false,message:error.message});
     }
  
  }