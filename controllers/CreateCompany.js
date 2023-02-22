import {Company} from "../models/companyModel.js";
import News from "../models/newsModel.js";
import aws from 'aws-sdk';
import multer from 'multer';
import path from "path";



const awsConfig = {

    secretAccessKey: 'GYpoBZ5BmDM0x9Jn4Irtxtw1NJbWpJzVx5Z3yh5h',
    accessKeyId: "AKIA5J2YBWKWWQZAMT4O",
    region: "ap-south-1",
    
};
const S3 = new aws.S3(awsConfig);

///check files

let upload = multer({
    limits:1024 * 1024 * 5,
    fileFilter:function(req,file,done){
if(file.mimetype === 'image/jpeg' || file.mimetype ==='image/png' || file.mimetype === 'image/jpg'){
done(null,true);
}else{
    done("File type is Unsupported",false)
}
    }
});



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

export const CreateCompany = async (req,res)=>{
    try {
        const {name,tag,dis,email,size,contact1,contact2,city,country,address,pincode,Website} = req.body;
        const {logo,banner} = req.files;
        const id = req.id;
      
        const existCompany = await Company.findOne({name:name});
        if(existCompany){
            return res.status(400).json({message:"Company Already exist !!!!!"});
        }
       
      
          const data = await uploadToS3(req.files.logo.data).then((result)=>{
                return result;
            }).catch((err)=>{
                console.log(err);
            })
        console.log(data,"Location");
        const data2 = await uploadToS3(req.files.banner.data).then((result)=>{
            return result;
        }).catch((err)=>{
            console.log(err);
        })
        
        console.log(data,"1");
        console.log(data2,"2")
        const companyData = await Company.create({id:id,name:name,tag:tag,email:email,size:size,
            discreption:dis,contact1:contact1,contact2:contact2,
            city:city,country:country,address:address,pincode:pincode,
            website:Website,logo:{id:data.ETag,url:data.Location},
            banner:{id:data2.ETag,url:data2.Location}})
      if(companyData){
        return res.status(200).json({message:"Company Created SuccessFully :)",data:companyData});
      }else{
        return res.status(400).json({message:"Company Not Created SuccessFully :)"});
      }
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:error});
    }
}

export const getCompany = async(req,res)=>{
    try {
        const {id} = req.body;
        
        const company = await Company.find({id:id});
        if(company){
            return res.status(200).json({message:"Your Company",data:company});
        }
     
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:error.keyValue});
    }
}



export const createNews = async(req,res)=>{
    try {
        const {title,news,imgLink} = req.body;
    
      const test = await News.findOne({title:title});
      console.log(test)
      if(test){
        return res.status(200).json({message:"exist"});
      }
     
            const data = await News.create({title:title,news:news,imgLink:imgLink});
            return res.status(201).json({message:"News created successfully ",data:data});
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:error});
    }
}

export const fetchNews = async(req,res)=>{
    try {
        const data = await News.find().sort([['createdAt',"desc"]]);
        res.status(200).json({mesage:"data fetch succesfully",data:data});
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:error});
    }
}