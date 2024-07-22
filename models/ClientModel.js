import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    location: {
      type: String,
      required: true,
      minlength: 5,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("Client", clientSchema);

export default Client;
