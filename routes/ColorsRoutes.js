import { getAllColors, createColor , updateColor , deleteColor} from "../controllers/ColorController.js";
import express from "express";

const colorRouter = express.Router();

colorRouter.get("/", getAllColors);
colorRouter.post("/create", createColor);
colorRouter.patch("/update/:id" , updateColor)
colorRouter.delete('/delete/:id' , deleteColor)

export default colorRouter;
