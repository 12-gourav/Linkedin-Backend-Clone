import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema;

const newsSchema = new mongoose.Schema({


  title: {
    type: String,
    unique:true,
  },
  news:{
    type:String,
  },

  imgLink:{
    type:String,
  }

},{timestamps:true})


const News = mongoose.models.News || mongoose.model('News',newsSchema);
export default News;