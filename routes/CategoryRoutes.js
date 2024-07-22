import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/CategoryController.js";
import express from "express";

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.post("/create", createCategory);
categoryRouter.patch("/update/:id", updateCategory);
categoryRouter.delete('/delete/:id',deleteCategory)

export default categoryRouter;
