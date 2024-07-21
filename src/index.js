// require('dotenv').config({path:'./env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path:'./.env'
})

// as connectDB is asyncronus function so it return the promisses so we handel it
// with then if succees and catch if ther is error
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MonogoDB connection failed !!!",err);
})






// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from "express"
// const app = express();

// ( async ()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//         app.on("error",(error)=>{
//             console.log("ERRR:",error);
//             throw error
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log('App is listing on port ${process.env.PORT}');
//         })
//     }
//     catch(error){
//         console.error('ERRR:',error)
//         throw error
//     }
// }) ()