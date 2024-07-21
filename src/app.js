import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// routes import
import userRouter from "./routes/user.router.js"

//routes declaration
app.use("/api/v1/users",userRouter)
// http://localhost:8000/api/v1/users/register
// here we will not use aap.get beacuse here we have written the controller and router at differnt place
// in app.get we write controller and router at same place
export {app}