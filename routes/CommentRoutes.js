import express from "express";
import { authenticate } from "../middleware/Auth.js";
import {
  addComment,
  addReply,
  deleteAll,
  deleteComment,
  getAllComments,
  getManyComments,
  getOneComment,
  updateComment,
} from "../controllers/CommentController.js";

const commentRouter = express.Router();

commentRouter.post("/", addComment);
commentRouter.get("/", getAllComments);
commentRouter.post("/byId", getOneComment);
commentRouter.delete("/", deleteComment);
commentRouter.patch("/", updateComment);
commentRouter.post("/reply", addReply);
commentRouter.post("/getMany", getManyComments);

commentRouter.delete("/delete/all", deleteAll);

export default commentRouter;
