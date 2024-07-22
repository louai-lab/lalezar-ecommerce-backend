import { createGmail } from "../controllers/GmailControllers.js";
import express from "express";

const gmailRouter = express.Router();

gmailRouter.post("/", createGmail);

export default gmailRouter;
