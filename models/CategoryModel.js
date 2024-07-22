import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    name_AR:{
      type:String,
      required:true
    }
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ createdAt: -1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;