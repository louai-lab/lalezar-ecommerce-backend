import mongoose from "mongoose";

const gmailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  subject: {
    type: String,
  },
  text: {
    type: String,
  },
  html: {
    type: String,
    required: true,
  },
});

const Gmail = mongoose.model("Gmail", gmailSchema);

export default Gmail;
