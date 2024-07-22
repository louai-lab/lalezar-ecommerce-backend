import express from "express";
import {
  getRevenue,
  getTopProducts,
  getMostCommonCountries,
  getDashboardInfo,
  getCategoryPercentage,
  getTopUsersByOrders,
} from "../controllers/DashboardController.js";

const dashRouter = express.Router();

dashRouter.get("/info", getDashboardInfo);
dashRouter.get("/category", getCategoryPercentage);
dashRouter.get("/user", getTopUsersByOrders);
dashRouter.post("/revenue", getRevenue);
dashRouter.post("/product", getTopProducts);
dashRouter.post("/countries", getMostCommonCountries);

export default dashRouter;
