import mongoose from"mongoose";
const {ObjectId} = mongoose.Schema;



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
    text:true,
  },
  totallikes:Number,
  totalFollow:Number,
  totalFollowers:Number,
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    text:true,
   
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
   
  },
  tag:{
    type:String,
    text:true,
  },
  dateofBirth:{
    type:String,
  },
  avatar: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      // required: true,
    },
  },
  role: {
    type: String,
    default: "NotPremium",
  },
  banner: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      // required: true,
    },
  },
  follow:{
    type:Array
  },
  followers:{
    type:Array
  },
  intrests:[
    {type:String}
  ],
  connect:[
    {
      id:ObjectId,
    }
  ],
  position:{
     type:String
    }
  ,
  about:{
    type:String,
    text:true,
  },
  city:{
type:String,
  },
  address:{
    type:String,
      },
country:{
        type:String,
 },
  Education:
    {type:String}
  ,
  skills:
    {type:String}
  ,
  Experience:{
    type:String,
  },
  addtional:{
    type:String
  },
  Website:{
    type:String
  },
  notifications:[{
    id:ObjectId,
    Message:String,
    Head:String,
    Type:String,
    name:String,
    url:String
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  allActivity:[
    {
      title:String,
      postId:{
        type:String,
        required:true,
      }
    }
  ],
  posts:[
    {
    type:ObjectId,
    ref:"Post"
    }
  ],
  verified:{
    type:Boolean,
    default:false
},
otp:Number,
otp_expiary:Date,
resetPasswordOtp:Number,
resetPasswordOtpExpiary:Date,
},{timestamps:true})

// delete user after a specefic time if otp expire before verify
userSchema.index({otp_expiary:1},{expireAfterSeconds:0});

const User =  mongoose.model('User', userSchema);
export default User;