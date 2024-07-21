import multer from "multer"

// multer: The multer library is a middleware for handling multipart/form-data,
//  which is primarily used for uploading files.

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
     // cb(null, file.fieldname + '-' + uniqueSuffix)
     cb(null,file.originalname)
    }
  })
  
 export const upload = multer({ storage,})

//  multer.diskStorage: Configures storage settings for uploaded files.
// destination: A function that specifies the destination directory for the uploaded files.
// req: The request object.
// file: The file object containing details about the file being uploaded.
// cb: A callback function that takes an error (if any) and the destination directory.
// cb(null, "./public/temp"): Specifies that the files should be saved in the ./public/temp directory.
// filename: A function that specifies the name of the file in the destination directory.
// req: The request object.
// file: The file object containing details about the file being uploaded.
// cb: A callback function that takes an error (if any) and the filename.
// cb(null, file.originalname): Uses the original name of the file for the stored file.
