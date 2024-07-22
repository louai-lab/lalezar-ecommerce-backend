import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    price : {
        type : Number ,
        required : true 
    },
    country : {
        type : String ,
        required : true
    },
    city : { 
        type : String ,
        required : true
    }
  },
  {
    timestamps: true,
  }
);

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
