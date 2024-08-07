import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title_en: {
      type: String,
      required: true,
      unique: true,
    },
    title_ar: {
      type: String,
      required: true,
    },
    description_en: {
      type: String,
      required: true,
    },
    description_ar: {
      type: String,
      required: true,
    },
    // images: [
    //   {
    //     type: String,
    //     required: false,
    //   },
    // ],
    image: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommentModel",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
