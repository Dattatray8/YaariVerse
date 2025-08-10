import express, { Router } from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  getCurrentUser,
  suggestedUsers,
} from "../controllers/user.controllers.js";

const userRouter = express(Router());

userRouter.get("/currentuser", isAuth, getCurrentUser);
userRouter.get("/suggestedusers", isAuth, suggestedUsers);

export default userRouter;
