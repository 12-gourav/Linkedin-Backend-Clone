import aws from 'aws-sdk';
import multer from 'multer';
import path from "path";
import Post from "../models/PostModel.js";
import User from "../models/userModel.js";

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


export const CreatePost = async (req,res)=>{
    try {
        const {id,title} = req.body;
        const {images} = req.files;
console.log(images);
        const imageArray=[];

        for(var i=0;i<images.length;i++){
            const avatarData = await uploadToS3(images[i].data).then((result)=>{
                return result;
            }).catch((err)=>{
                console.log(err);
            });
            imageArray.push({url:avatarData.Location,id:avatarData.ETag.toString()});
        }

        const post = await Post.create({user_id:id,title:title,image:imageArray});
        const data = await User.findByIdAndUpdate({_id:id},{$push:{posts:post._id}});

        if(post && data){
            return res.status(201).json({message:"Post Saved successfully :)",data:post});
        }
        res.status(400).json({message:"Post Not saved"})
        
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }
}

export const CreateVideoPost = async (req,res)=>{
    try {
        const {id,title} = req.body;
        const {video} = req.files;
        console.log(video);
        // const imageArray=[];

        // for(var i=0;i<images.length;i++){
        //     const avatarData = await uploadToS3(images[i].data).then((result)=>{
        //         return result;
        //     }).catch((err)=>{
        //         console.log(err);
        //     });
        //     imageArray.push({url:avatarData.Location,id:avatarData.ETag.toString()});
        // }
        const avatarData = await uploadToS3(video.data).then((result)=>{
                    return result;
                }).catch((err)=>{
                    console.log(err);
                });
                // imageArray.push({url:avatarData.Location,id:avatarData.ETag.toString()});
                const vdata = {
                    url:avatarData.Location,
                    id:avatarData.ETag.toString()
                }

        const post = await Post.create({user_id:id,title:title,video:vdata});
        const data = await User.findByIdAndUpdate({_id:id},{$push:{posts:post._id}});

        if(post && data){
            return res.status(201).json({message:"Post Saved successfully :)",data:post});
        }
        res.status(400).json({message:"Post Not saved"})
        
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }
}


export const fretchPost = async (req,res)=>{
    try {
        console.log(req.params.count);
            let products = await Post.find({}).limit(parseInt(req.params.count))
            .populate({
                path: 'user_id',
               
              })
            .sort([['createdAt',"desc"]])
            .exec();
    console.log(products);
            return res.status(200).json({message:"Data fetch successfully",data:products});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }
}

export const LikePast = async (req,res)=>{
    try {
        const {pid} = req.body;
        const product = await Post.findOneAndUpdate({$and:[{_id:pid},{likes:req.id}]},{$pull:{likes:req.id}});
       
        if(product){
             return res.status(200).json({message:"like pull out",data:product});
        }
       
        const data = await Post.findByIdAndUpdate({_id:pid},{$push:{likes:req.id}});
         res.status(200).json({message:"likes success",data:data});
            
        
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }
}


export const comment = async (req,res)=>{
    try {
        const {pid,comment,name,url} = req.body;
        const product = await Post.findByIdAndUpdate({_id:pid},{$push:{comments:{id:req.id,comment:comment,name:name,url:url}}})
        if(product){
            return res.status(201).json({message:"Comment saved successfully"});
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }
}

export const commentId = async (req,res)=>{
    try {
const {pid} = req.body;
console.log(pid);
        const product = await Post.findById({_id:pid}).populate("user_id");
        if(product){
            return res.status(201).json({message:"Data fetch successfully",data:product});
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }
}

export const DeleteComment = async (req,res)=>{
    try {
const {pid,cid} = req.body;
console.log(pid);
        const product = await Post.findByIdAndUpdate({_id:pid},{$pull:{comments:{_id:cid}}}).populate("user_id");
        if(product){
            return res.status(201).json({message:"Data Delete successfully",data:product});
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }
}

//1 based on text
export const handleQuery = async(req,res)=>{
    const {query} = req.body;
    console.log(query);
    const products = await Post.find({$text:{$search:query}})
    .populate({
        path: 'user_id',
      })
    .exec();
    const user = await User.find({$text:{$search:query}});

    res.status(200).json({message:"search",post:products,user:user});

    // res.json(products);
    
    }