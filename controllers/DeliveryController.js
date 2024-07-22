import mongoose from "mongoose";
import Delivery from "../models/DeliveryModel.js";

// Controller for adding a new delivery
export const addDelivery = async (req, res) => {
  const { price, country, city } = req.body;

  try {
    if (!price || isNaN(price)) {
      return res.status(400).json({ error: "Invalid or missing price" });
    }

    if (!country) {
      return res.status(400).json({ error: "Country is required" });
    }

    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    const newDelivery = await Delivery.create({ price, country, city });

    res.status(200).json(newDelivery);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};

// Controller for editing a delivery
export const editDelivery = async (req, res) => {
  const id = req.body.id;
  const { price, country, city } = req.body;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid delivery ID" });
    }

    if (!price || isNaN(price)) {
      return res.status(400).json({ error: "Invalid or missing price" });
    }

    if (!country) {
      return res.status(400).json({ error: "Country is required" });
    }

    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    const existingDelivery = await Delivery.findById(id);

    if (!existingDelivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    const updatedDelivery = await Delivery.findByIdAndUpdate(
      id,
      { price, country, city },
      { new: true }
    );

    res.status(200).json(updatedDelivery);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};

// Controller for deleting a delivery
export const deleteDelivery = async (req, res) => {
  const id = req.body.id;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid delivery ID" });
    }

    const deletedDelivery = await Delivery.findByIdAndDelete(id);

    if (!deletedDelivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    res.status(200).json({ message: "Delivery deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};

// Controller for getting all deliveries
export const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};


export const getUniqueCountriesCount = async (req, res) => {
  try {
    const result = await Delivery.aggregate([
      {
        $group: {
          _id: null,
          uniqueCountries: { $addToSet: "$country" },
        },
      },
      {
        $project: {
          _id: 0,
          count: { $size: "$uniqueCountries" },
        },
      },
    ]);

    const count = result.length > 0 ? result[0].count : 0;

    return res.status(200).json(count);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};