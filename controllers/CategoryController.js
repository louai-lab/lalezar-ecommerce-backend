import Category from "../models/CategoryModel.js";
import mongoose from "mongoose";

// Get All Categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    const categoryCount = categories.length;

    // return res.status(200).json(categories);
    return res.status(200).json({ categories, categoryCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  const { name, name_AR } = req.body;

  try {
    const newCategory = await Category.create({
      name,
      name_AR,
    });

    res.status(200).json(newCategory);
  } catch (error) {
    console.log(error);
    res.status(404).json("Internal Server Error");
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  const id = req.params.id;
  const { name, name_AR } = req.body;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const existingCategory = await Category.findById(id);

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updatedCategoryData = {
      name: name,
      name_AR: name_AR,
    };

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updatedCategoryData,
      {
        new: true,
      }
    );

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  const id = req.params.id;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const category = await Category.findOne({ _id: id });

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};
