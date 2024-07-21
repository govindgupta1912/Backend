import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
    });

    const uploadOnCloudinary = async(localfilePath)=>{
        
        try {
            if(!localfilePath) return null;
            //upoload the file on cloudinary

            const response = await cloudinary.uploader.upload
            (
                localfilePath,{
                    resource_type:"auto"// accept all type of resourse pdf image,etc
                }
            )
            //file has beeen uploaded succesfull
            console.log("file is uploaded on cloudinary");
            console.log("cloudinary response:", response);
            fs.unlinkSync(localfilePath)
            return response;
           
        } catch (error) {
            fs.unlinkSync(localfilePath)
            // remove the locally saved temporay file as the upload operation got failed and do it synchronously(imeeditly)

            return null;
        }
    }

    export {uploadOnCloudinary}