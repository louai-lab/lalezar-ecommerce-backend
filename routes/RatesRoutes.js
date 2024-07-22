import {
    getRates,
    addRate,
    editRate,
    deleteRate
  } from "../controllers/RateController.js";
  import express from "express";
  
  const rateRouter = express.Router();
  
  rateRouter.get("/get", getRates);
  rateRouter.post("/add", addRate);
  rateRouter.patch("/edit", editRate);
  rateRouter.delete('/delete',deleteRate)
  
  export default rateRouter;
  