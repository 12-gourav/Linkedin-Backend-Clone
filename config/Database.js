import mongoose from "mongoose";

mongoose.set('strictQuery', false);
export const database = ()=>{
  
    mongoose.connect("mongodb+srv://gourav:gouravbajpai@cluster0.1u6vn87.mongodb.net/?retryWrites=true&w=majority").then(()=>{
        console.log("Database connect Successfullyt :)");
    }).catch((err)=>{
        console.log(err);
    })

}