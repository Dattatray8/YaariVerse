import express, { Router } from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  editProfile,
  getCurrentUser,
  getProfile,
  suggestedUsers,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multur.js";

const userRouter = express(Router());

userRouter.get("/currentuser", isAuth, getCurrentUser);
userRouter.get("/suggestedusers", isAuth, suggestedUsers);
userRouter.post(
  "/editProfile",
  isAuth,
  upload.single("profileImage"),
  editProfile
);
userRouter.get("/profile/:userName", isAuth, getProfile);

export default userRouter;
