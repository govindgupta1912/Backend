import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
    videoFile: {
        type: String,// cloudinary url
        required: true
    },
    thumbnail: {
        type: String ,//cloudinary url
        required:true
    },
    title :{
        type: String,
        required: true
    },
    description: {
        type: String,
        required:true
    },
    duration: {
        type: Number,
        required:true
    },
    views: {
        type: Number,
        default : 0
    },
    isPublished: {
        type: Boolean,
        default : true
    },
    owner:{
      type: Schema.Types.ObjectId,
      ref:"User"
    }

    },
    {
        timestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

//  Applies the mongoose-aggregate-paginate-v2 plugin to the schema, which adds pagination 
//  capabilities to Mongoose's aggregate queries.

// The mongoose-aggregate-paginate-v2 plugin adds pagination capabilities to Mongoose's aggregate queries.
//  Here's how it works:

// Pagination: Allows you to paginate through large datasets efficiently by limiting the number of documents 
// returned in a single query and providing metadata about the pagination.
// Usage: After applying the plugin to a schema, you can use the paginate method on aggregate queries to 
// paginate the results.

// Pagination is a technique used in software development, especially in web applications, to divide large 
// datasets into smaller, manageable chunks or pages. This allows 
// users to navigate through the data more easily and improves the performance and user experience of applications.

export const Video = mongoose.model("Video",videoSchema)