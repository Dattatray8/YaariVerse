import express from "express";
import dotenv from "dotenv";
import { dbConnection } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import shortsRouter from "./routes/shortVerse.routes.js";
import storyRouter from "./routes/story.routes.js";
import messageRouter from "./routes/message.routes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/short", shortsRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);

app.listen(process.env.PORT || 5000, () => {
  dbConnection();
  console.log(`Server learning on PORT ${process.env.PORT}`);
});
