import express from "express";
import comapny from "./Routes/CompanyRoutes.js"
import post from "./Routes/PostRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import {database} from "./config/Database.js";
import morgan from "morgan";
import { config } from "dotenv";
import auth from "./Routes/Auth.js";
import user from "./Routes/UserRoutes.js"
const app = express();

const port = process.env.PORT || 5000;

///initialize path for dotenv config
config({
    path:"./config/.env"
})



//// 1-database connectivity---------------------
database();
// <--------------------------------------->////////

////initialize the middlewares

app.use(morgan("dev"));
// const corsOpts = {
//     origin: '*',
//     credentials: true,
//     methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
//     allowedHeaders: ['Content-Type'],
//     exposedHeaders: ['Content-Type']
// };
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

//////////////////////////////////////////////////////////
console.log("hiii");

// 2---using terms most important when we use formdata
app.use(fileUpload({
    limits:{fileSize:50 * 1024 * 1024},
   
}));
/////////////////////////////////////////////////

///3----routes
app.use("/api/v1",comapny);
app.use("/api/v1",post);
app.use("/api/v1",auth);
app.use("/api/v1",user);



///////////


// 4----define initial routes for checking

app.get("/",(req,res)=>{
    res.status(200).json({message:"Server is Running Perfectly :)"});
});

////////////////////////////////////////////


///5-----define server
app.listen(port,()=>{
    console.log(`Serrver is running on the port no ${port}`);
})