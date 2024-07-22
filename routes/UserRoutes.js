import {
  SignUp,
  addUser,
  editUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  logIn,
  loggedInUser,
  logOut,
} from "../controllers/UserController.js";
import { google } from "../controllers/OAuth.js";
import express from "express";
import upload from "../middleware/Multer.js";
import { authenticate } from "../middleware/Auth.js";

const userRouter = express.Router();

userRouter.post("/signup", upload.single("image"), SignUp);
userRouter.post("/byId", getOneUser);
userRouter.get("/", getAllUsers);
userRouter.post("/", upload.single("image"), addUser);
userRouter.patch("/", upload.single("image"), editUser);
userRouter.delete("/", deleteUser);
userRouter.post("/login", logIn);
userRouter.post("/logout", logOut);
userRouter.get("/logged-in-user", authenticate, loggedInUser);
userRouter.post("/google", google, loggedInUser);
// userRouter.post("/google", google);

export default userRouter;
