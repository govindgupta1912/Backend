import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";

// mongoose: The Mongoose library for interacting with MongoDB.
// { Schema }: A shorthand for mongoose.Schema, used to define the
// structure of the documents in a MongoDB collection.
// jwt: The jsonwebtoken library for creating and verifying JSON Web Tokens.
// bcrypt: The bcrypt library for hashing and comparing passwords.

const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true

        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName:{
            type:String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudinary yrl
            required: true,
        },
        coverImage: {
            type: String, //cloudinary yrl
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required : [true,'Password is required']
        },
        refershToken: {
            type: String
        }
        

    },
    {
        timestamps: true
    }
)

// Fields:
// username: A unique, lowercase, trimmed string used as the user's identifier.
// email: A unique, lowercase, trimmed string used for the user's email.
// fullName: A trimmed string representing the user's full name.
// avatar: A string for the user's avatar URL (e.g., from Cloudinary).
// coverImage: A string for the user's cover image URL (optional).
// watchHistory: An array of references to Video objects.
// password: A required string for the user's password.
// refreshToken: A string for storing the user's refresh token.
// Options:
// timestamps: true: Automatically adds createdAt and updatedAt timestamps.

userSchema.pre("save", async function (next){

    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password,10)
    next()
})

// This middleware runs before a User document is saved (pre("save")).
// If the password field has not been modified, it skips the middleware (return next()).
// If the password field has been modified, it hashes the password with bcrypt before saving it.

userSchema.methods.isPasswordCorrect =async function (password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
  return  jwt.sign(
        {
        _id: this._id,
        email:this.email,
        username: this.username,
        fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return   jwt.sign(
        {
        _id: this._id,
        
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const  User = mongoose.model("User",userSchema)


// isPasswordCorrect:
// Compares a given password with the hashed password stored in the database using bcrypt.compare.
// Returns true if the passwords match, false otherwise.
// generateAccessToken:
// Generates a JSON Web Token (JWT) for the user, including their _id, email, username, and fullName.
// Uses a secret key from the environment variable ACCESS_TOKEN_SECRET.
// Sets the token's expiration time using the ACCESS_TOKEN_EXPIRY environment variable.
// generateRefreshToken:
// Generates a refresh token for the user, including only their _id.
// Uses a secret key from the environment variable REFRESH_TOKEN_SECRET.
// Sets the token's expiration time using the REFRESH_TOKEN_EXPIRY environment variable.

// Creating and Exporting the Model:

// Creates a Mongoose model named User based on the userSchema.
// Exports the User model for use in other parts of the application.

// Summary
// This code defines a User schema and model for a MongoDB database using Mongoose. 
// It includes fields for user information, pre-save middleware to hash passwords, and instance methods
//  for password comparison and token generation. The mongoose model and schema allow for structured data
//   storage and retrieval, while the bcrypt and jwt libraries provide security for user passwords and token-based
//    authentication.
