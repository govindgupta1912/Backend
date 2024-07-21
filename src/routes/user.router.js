import { Router } from "express";
import { logedOutUser, loginUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([{
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
    ]),
    registerUser)

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logedOutUser)
export default router;

// router.route("/register").post(...): This sets up a POST route for the /register endpoint. When a POST request
//  is made to /register, the specified middleware and handler function will be executed.
// upload.fields(...): This middleware handles the file uploads. It specifies that the request can contain:
// An avatar field with a maximum of 1 file.
// A coverImage field with a maximum of 1 file.
// upload.fields is a multer method that allows handling multiple fields with different file upload rules.
// registerUser: This is the route handler function that processes the request after the files are handled by
//  the upload middleware.

//  Why upload.fields is Used
// Handling Multiple File Uploads:

// In many web applications, users might need to upload multiple files through a single form or request.
// For example, a user profile might include an avatar image and a cover image.
// upload.fields allows you to define how these multiple files should be processed and stored.
// Specifying Field Names and Limits:

// With upload.fields, you can specify the exact field names that you expect in the incoming request and
// set limits on the number of files each field can accept.
// This adds an extra layer of validation and ensures that the server handles the files correctly according 
//to your application's requirements.
// Efficient and Scalable:

// By defining rules for each field, you can manage file uploads more efficiently, making your application more robust and scalable.