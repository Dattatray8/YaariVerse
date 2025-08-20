import express, { Router } from "express";
import {
  getAllMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multur.js";

const messageRouter = express(Router());

messageRouter.post(
  "/send/:receiverId",
  isAuth,
  upload.single("image"),
  sendMessage
);
messageRouter.get("/getAll/:receiverId", isAuth, getAllMessages);
// messageRouter.get("/prevchat", isAuth, getPrevUserChat);

export default messageRouter;
