import Color from "../models/ColorModel.js";
import mongoose from "mongoose";

// Get All Colors
export const getAllColors = async (req, res) => {
  try {
    const colors = await Color.find();
    return res.status(200).json(colors);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new color
export const createColor = async (req, res) => {
  const { hex , name } = req.body;

  try {
    const newColor = await Color.create({
      hex,
      name
    });

    res.status(200).json(newColor);
  } catch (error) {
    console.log(error);
    res.status(404).json("Internal Server Error");
  }
};

// Update a color
export const updateColor = async (req, res) => {
  const id = req.params.id;
  const { hex , name} = req.body;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid color ID" });
    }

    const existingColor = await Color.findById(id);

    if (!existingColor) {
      return res.status(404).json({ error: "Color not found" });
    }

    const updatedColorData = {
      hex : hex,
      name: name
    };

    const updatedColor = await Color.findByIdAndUpdate(
      id,
      updatedColorData,
      {
        new: true,
      }
    );

    res.status(200).json(updatedColor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

// Delete a color
export const deleteColor = async (req, res) => {
  const id = req.params.id;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid color ID" });
    }

    const color = await Color.findOne({ _id: id });

    const deletedColor = await Color.findByIdAndDelete(id);

    if (!deletedColor) {
      return res.status(404).json({ error: "Color not found" });
    }

    res.status(200).json({ message: "Color deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};
