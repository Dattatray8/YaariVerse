import express, { Router } from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  editProfile,
  follow,
  followingList,
  getAllNotfications,
  getCurrentUser,
  getProfile,
  markAsRead,
  search,
  suggestedUsers,
  updateFcmToken,
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
userRouter.get("/follow/:targetUserId", isAuth, follow);
userRouter.get("/followinglist", isAuth, followingList);
userRouter.get("/search", isAuth, search);
userRouter.get("/getallnotification", isAuth, getAllNotfications);
userRouter.post("/markasread", isAuth, markAsRead);
userRouter.post("/fcmToken", isAuth, updateFcmToken);

export default userRouter;
