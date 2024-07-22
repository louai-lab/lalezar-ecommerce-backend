import Rate from "../models/RateModel.js";
import mongoose from "mongoose";

// Get All Rates
export const getRates = async (req, res) => {
  try {
    const rates = await Rate.find().populate('user');
    return res.status(200).json(rates);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new rate
export const addRate = async (req, res) => {
  const { rate, userId ,productId } = req.body;

  try {
    const newRate = await Rate.create({
      rate,
      userId,
      productId,
    });

    res.status(200).json(newRate);
  } catch (error) {
    console.log(error);
    res.status(404).json("Internal Server Error");
  }
};

// Update a rate
export const editRate = async (req, res) => {
  const id = req.body.id;
  const { rate, user } = req.body;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid rate ID" });
    }

    const existingRate = await Rate.findById(id);

    if (!existingRate) {
      return res.status(404).json({ error: "Rate not found" });
    }

    const updatedRateData = {
      rate,
      user,
      // product,
    };

    const updatedRate = await Rate.findByIdAndUpdate(id, updatedRateData, {
      new: true,
    });

    res.status(200).json(updatedRate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

// Delete a rate
export const deleteRate = async (req, res) => {
  const id = req.body.id;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid rate ID" });
    }

    const rate = await Rate.findOne({ _id: id });

    const deletedRate = await Rate.findByIdAndDelete(id);

    if (!deletedRate) {
      return res.status(404).json({ error: "Rate not found" });
    }

    res.status(200).json({ message: "Rate deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};
