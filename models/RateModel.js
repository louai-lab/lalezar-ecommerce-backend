import mongoose from 'mongoose';


const RateSchema = new mongoose.Schema({
    rate: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'product',
    },
 },
 {
    timestamps: true,
  }

);


const Rate = mongoose.model('Rate',RateSchema);

export default Rate;

