import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Initiated", "In Process", "Sent", "Delivered", "Declined"],
      default: "Initiated",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderDetails: {
      type: Object,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
