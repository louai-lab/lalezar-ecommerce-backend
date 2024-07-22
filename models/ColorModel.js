import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    hex: {
      type: String,
      required: true,
    },
    name : {
      type: String ,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Color = mongoose.model("Color", colorSchema);

export default Color;