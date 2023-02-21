import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    id:{
        type:String,
        required:true,
        unique: true,
      },
    name: {
        type: String,
        required: [true, "Please Enter Your Company Name"],
        maxLength: [50, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
        unique:true
      },
      tag:{
        type:String,
        required:true,
      },
      email:{
        type:String,
        required:true,
        unique: true,
      },
      size:{
        type:Number,
        required:true,
      },
      discreption:{
        type:String,
        required:true,
      },
      contact1:{
        type:String,
        required:true,
      },
      contact2:{
        type:String,
        required:true,
      },
      city:{
        type:String,
        required:true,
      },
      country:{
        type:String,
        required:true,
      },
      address:{
        type:String,
        required:true,
      },
      pincode:{
        type:String,
        required:true,
      },
      website:{
        type:String,
        required:true,
        unique:true
      },
      logo:{
        id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true
        }
      },
      banner:{
        id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true
        }
      },
},{timestamps:true});


export const Company = mongoose.model("Company",companySchema);