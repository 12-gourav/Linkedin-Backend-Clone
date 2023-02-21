import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema;

const postSchema = new mongoose.Schema({
  user_id: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  shareUser: {
    id: ObjectId,
    text:String
  },
  title: {
    type: String,
    text:true,
    // minLength: [5, "Name should have more than 4 characters"],
  },
  image: Array,
  video: Array,
  comments: [
    {
      name:String,
      url:String,
      comment:String,
      id:String,
    }
  ],
  views:{
    type:Number,
  },
  likes: [
    {
      type: ObjectId,
      ref: "User",
      unique:"true"
    }
  ],
  sharedCaption:{
    type:String,
  },

},{timestamps:true})


const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default Post;