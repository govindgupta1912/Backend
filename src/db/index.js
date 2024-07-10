import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try{
     const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
     console.log(`\n Monodb connected !! DB HOST :${connectionInstance.connection.host}`);
    }
    catch(error){
        console.log("MONGODB CONNECTION SRROR", error);
        process.exit(1)
        // need to undeestand this
    }
}

export default connectDB;