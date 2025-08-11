import express, { Router } from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multur.js";
import {
  comment,
  getAllShorts,
  like,
  uploadShort,
} from "../controllers/shortVerse.controller.js";

const shortsRouter = express(Router());

shortsRouter.post("/upload", isAuth, upload.single("media"), uploadShort);
shortsRouter.get("/getAll", isAuth, getAllShorts);
shortsRouter.get("/like/:shortId", isAuth, like);
shortsRouter.post("/comment/:shortId", isAuth, comment);

export default shortsRouter;
