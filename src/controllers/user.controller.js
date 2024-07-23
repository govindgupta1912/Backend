import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefernceTokens= async(userId)=>{
        try {

            const user = await User.findById(userId);
            const accessToken= user.generateAccessToken()
            const refernceToken = user.generateRefreshToken()

           user.refershToken=refernceToken;
        //    console.log(accessToken);
        //    console.log(refernceToken);
        //    console.log(user.refershToken);
           // put the value of refresh token in database so that we do,not have to ask value to user each time
            await user.save({validateBeforeSave:false})
            // when we wil save the user data in database mogoees model get kickin 
            //and it wiil ask for password because that is required field
            // so to handel that we make validation off
            return{accessToken,refernceToken}
        } catch (error) {
            throw new ApiError(500,"something went worng while genreatinhg the access and refernce token")
        }
}

const registerUser = asyncHandler(async (req, res) => {
    // res.status(500).json({
    //     message: "OK"
    // })
    // get user detail from frontend
    //validation - not empty
    // check if user already exit: username, email
    // check for image,check for avatar
    //upload them to cloudinary ,avatar
    //crate user object - create entry in db
    // remove password and refersh token field from response
    // check for user creation
    // return res

    const { fullName, email, username, password } = req.body
    console.log("email:", email);
    console.log("request body->", req.body);
    //     req.body is used in an Express.js application to access the data that is sent in the body 
    //     of an HTTP request, typically in POST or PUT requests. This data is usually sent from the 
    //     client side (e.g., from a web form or a JSON payload in an API request) and is then processed on the server side.

    // Here's why req.body is important and how it is used:

    // Accessing Form Data:

    // When a client sends data via a form submission (with method="POST"), the server can access the
    // submitted form data using req.body.

    // Handling JSON Payloads:

    // For APIs, clients often send data as JSON in the body of the request. Using req.body, the server can parse
    //  and access this JSON data.


    // if(fullName===""){
    //     throw new ApiError(400,"fullname is requried")
    // }

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all filed are required")

    }

    //     Why .some is Used
    //     Validation:
    //     .some is used to perform a quick check on an array of elements to determine if at least one element meets a specified condition.
    //      This is particularly useful for validation checks.
    //     In your code, it's used to ensure that none of the required fields (fullName, email, username, password) 
    //     are empty or contain only whitespace.

    //     An array is created with the values of fullName, email, username, and password extracted from req.body.

    //     The .some method iterates over each element in the array.
    // For each element (field), it checks if field?.trim() === "".
    // field?.trim() trims any whitespace from the beginning and end of the string. The optional chaining operator (?.)
    //  ensures that if field is null or undefined, it doesn't throw an error.
    // If the trimmed string is an empty string (""), the condition returns true.
    // Condition Check:

    // If at least one element in the array satisfies the condition (trimmed string is empty), .some returns true.
    // If none of the elements satisfy the condition, .some returns false.

    const exitedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    console.log("exiteduser data:-", exitedUser);

    if (exitedUser) {
        throw new ApiError(409, "user with email or username already exits")
    }

    

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // why optional channing is not working

    const avatarLocalPath = Array.isArray(req.files?.avatar) && req.files.avatar.length > 0 ? req.files.avatar[0].path : undefined;


    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    console.log("req files structure:-", req.files.avatar);

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {

        coverImageLocalPath = req.files.coverImage[0].path
    }

    //     Why req.files is Used
    // File Upload Handling:

    // When a client uploads files (such as images, documents, etc.) through a form or an API request, these 
    // files need to be processed and stored on the server or a cloud storage service.
    // req.files provides access to these uploaded files, allowing the server to handle them appropriately.
    // Middleware for Parsing Multipart Form Data:

    // Express.js does not natively handle multipart/form-data, which is the encoding type used for file uploads. 
    // Middleware like multer is used to parse this type of data and populate req.files with the uploaded file information.
    // This middleware processes the uploaded files and makes them accessible via req.files.


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avtar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    console.log("cloudinary response avtar", avatar);

    if (!avatar) {
        throw new ApiError(400, "Avtar file is required cloudinary")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        " -password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while regestring thr user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registerd")
    )
})

const loginUser = asyncHandler( async (req,res)=>{

    // req body-> email,usernmae,password
    //username,email
    // find user
    //password check
    //acces and refernce token 
    //send cookies

    const {email,username,password}=req.body

    if(!(username||email)){
        throw new ApiError(400,"usernmae or email is required");
    }
  

    console.log(username);
    console.log(email);
    const user= await User.findOne({
        $or:[{username},{email}]
    })
    // findOne return the first elemnt find in database

    if(!user){
        throw new ApiError(404,"user does'nt exit")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    // here we use user(not User) beacause User is inastance of mongodb database which is used to acces the mongooes method
    // lik finone(),findbyId()
    // but user is an inastance of our user so to access the method which we haave created in model like
    // isPasswordCorrect,genreateRefernce token we will use  'user' object

    if(!isPasswordValid){
        throw new ApiError(404,"Invalid user credentials");
    }
    
    const {accessToken,refershToken}= await generateAccessAndRefernceTokens(user._id)

    const loogedInUser = await User.findById(user._id).select("-password -refreshToken");
    // it take the updated user with refershToken
    const Options ={
        httpOnly:true,
        secure:true
    }
// now tht cokies will be modified by server only from frontend it can't be modified so we use option with cooies
    return res
           .status(200)
           .cookie("accessToken",accessToken,Options)
           .cookie("refernceToken",refershToken,Options)
           .json(
            new ApiResponse(
                200,
                {
                    user:loogedInUser,accessToken,refershToken
                },
                "user logged in successfully"
            )
           )
})

const logedOutUser = asyncHandler( async(req,res)=>{

    console.log(  req.loguser._id);
    await User.findByIdAndUpdate(
        req.loguser._id,
        {
            $set:{
                refershToken:undefined
             
            }
            // this set opreator will update the refershToken with undefined
        },
        {
            new:true
            // this will return the new updated value otherwise old refreshToken
        }
    )

    const Options={
        httpOnly:true,
        secure:true
    }

    return res
          .status(200)
          .clearCookie("accessToken",Options)
          .clearCookie("refernceToken",Options)
          .json(new ApiResponse(200,{},"user Logged out"))

})

const refreshAccessToken=asyncHandler(async(req,res)=>{

    const  incomingRefreshToken=req.cookie.refernceToken||req.body.refernceToken
    // check and not understand

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized Request")
    }

    try {
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
          const user= await User.findById(decodedToken._id)
        if(!user)
        {
            throw new ApiError(401,"invalid refresh token")
        }
    
        if(incomingRefreshToken!== user?.refershToken){
            throw new ApiError(401,"refersh token is expird or used")
        }
    
        const {newrefernceToken,accessToken}=await generateAccessAndRefernceTokens(user._id);
    
        const options={
            httpOnly:true,
            secure:true
        }
        
        return res
               .status(200)
               .cookie("accesToken",accessToken,options)
               .cookie("refernceToken",newrefernceToken,options)
               .json( new ApiResponse(200,
               { accessToken,refershToken:newrefernceToken},
               "access token refreshed"
               ))
    } catch (error) {
        throw new ApiError(401,error?.message||"Invalid refresh token")

        
    }
})

export { registerUser,loginUser,logedOutUser,refreshAccessToken }