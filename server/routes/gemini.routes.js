import express, { Router } from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multur.js";
import { geminiGeneratedCaption } from "../services/gemini.servies.js";

const geminiRouter = express(Router());

geminiRouter.post(
  "/caption",
  isAuth,
  upload.single("image"),
  geminiGeneratedCaption
);

export default geminiRouter;
