import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT= asyncHandler(async(req,_,next)=>{

     try {
         const token =req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer","");
         // not understand authorization
         //we are fecthing the access token from cookies
   
         if(!token){
           throw new ApiError(401,"unautherized request")
         }

         console.log("Token:",token);
   
         const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
         // after we get the access token from cooikes then we verfiy it or decode it using  Access_tokren_secret
         // and we are able to get the access token from cookies because we have add it to cooies while login
   
         const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
         // when we have geantated the access token we have privided '_id' is userModel so we able use it in decode token
           console.log("user:-",user);
         if(!user){
           // descision in next video
           throw new ApiError(401,"Invalid Access Token");
         }
   
         req.loguser=user;
         // we add new object loguser in req  and given the access of user
         next();
     } catch (error) {

        throw new ApiError(401,error?.message||"invalid Access token");
        
     }
})