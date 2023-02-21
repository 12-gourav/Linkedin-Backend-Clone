import User from "../models/userModel.js";
import aws from 'aws-sdk';
import multer from 'multer';
import path from "path";


const awsConfig = {

    secretAccessKey: 'GYpoBZ5BmDM0x9Jn4Irtxtw1NJbWpJzVx5Z3yh5h',
    accessKeyId: "AKIA5J2YBWKWWQZAMT4O",
    region: "ap-south-1",
    
};
const S3 = new aws.S3(awsConfig);


///bucket Config

const uploadToS3 = (fileData)=>{
    return new Promise((resolve,reject)=>{
        console.log(fileData,"file data set1234567890----");
        const params = {
            Bucket:"favshop",
            Key:`${Date.now().toString()}.jpg`,
            Body:fileData,

        }
        S3.upload(params,(err,data)=>{
            if(err){
                console.log(err);
                reject(err);
            }
            console.log(data);
            return resolve(data);
        })
    })
}


export const UserInfo = async (req,res)=>{
    try {
const {id,name,tag,dob,position,about,education,skills,experiance,city,address,country,addtional,Website} = req.body;
const {avatar,banner} = req.files;

const checkUser = await User.findOne({_id:id});
if(checkUser){
         
    const avatarData = await uploadToS3(req.files.avatar.data).then((result)=>{
        return result;
    }).catch((err)=>{
        console.log(err);
    })

    const bannerData = await uploadToS3(req.files.banner.data).then((result)=>{
    return result;
    }).catch((err)=>{
      console.log(err);
     })

console.log(avatarData,"1");
console.log(bannerData,"2");

const data = await User.findByIdAndUpdate({_id:id},
    {dateofBirth:dob,position:position,about:about,tag:tag,city:city,country:country,address:address,
        addtional:addtional,Website:Website,name:name,skills:skills,
        Education:education,Experience:experiance,
        avatar:{ public_id:avatarData.ETag,url:avatarData.Location},
        banner:{ public_id:bannerData.ETag,url:bannerData.Location}
    })

    if(data){
        return res.status(201).json({message:"Profile Info Saved Successfully :)",data:data});
    }
}
return res.status(400).json({message:"User Does Not Exists"});    
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:error});
    }
}


export const UpdateUserInfo = async (req,res)=>{
    try {
        const {id,tag,dob,position,about,education,skill,experiance,city,address,country,addtional,Website} = req.body;
        const {avatar,banner} = req.files;
const checkUser = await User.findOne({_id:id});
if(checkUser){
         
    const avatarData = await uploadToS3(req.files.avatar.data).then((result)=>{
        return result;
    }).catch((err)=>{
        console.log(err);
    })

    const bannerData = await uploadToS3(req.files.banner.data).then((result)=>{
    return result;
    }).catch((err)=>{
      console.log(err);
     })

console.log(avatarData,"1");
console.log(bannerData,"2");

const data = await User.findById({_id:id},
    {dateofBirth:dob,position:position,about:about,tag:tag,city:city,country:country,address:address,
        addtional:addtional,Website:Website,
        Education:education,skills:skill,Experience:experiance,
        avatar:{ public_id:avatarData.ETag,url:avatarData.Location},
        banner:{ public_id:bannerData.ETag,url:bannerData.Location}
    })

    if(data){
        return res.status(201).json({message:"Profile Info Update Successfully :)"});
    }
}
return res.status(400).json({message:"User Does Not Exists"});   
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:error});
    }
}


export const getUserInfo = async (req,res)=>{
    try {
        const {id} = req.body;
        const user = await User.findById({_id:id});
        if(user){
            return res.status(200).json({message:"User exist",data:user});
        }
        else{
            return res.status(400).json({message:"User Not exists !!!!!!"})
        }
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:error});
    }
}