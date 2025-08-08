import express, { Router } from "express";
import isAuth from "../middlewares/isAuth.js";
import { getCurrentUser } from "../controllers/user.controllers.js";

const userRouter = express(Router());

userRouter.get("/currentuser", isAuth, getCurrentUser);

export default userRouter;
