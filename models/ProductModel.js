import mongoose from "mongoose";
import Color from "./ColorModel.js";
import Category from "./CategoryModel.js";

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    name_AR: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    description_AR: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "Price must be a positive number",
      },
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    ingredients: {
      type: String,
    },
    ingredients_AR: {
      type: String,
    },
    stock: {
      type: Boolean,
      required: true,
    },
    note: {
      type: String,
    },
    note_AR: {
      type: String,
    },
    display: {
      type: Boolean,
    },
    slug: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", ProductSchema);

export default Product;
