import express from "express";
import dotenv from "dotenv";
import { dbConnection } from "./config/db.js";

dotenv.config();

const app = express();

app.listen(process.env.PORT || 5000, () => {
  dbConnection();
  console.log(`Server learning on PORT ${process.env.PORT}`);
});
