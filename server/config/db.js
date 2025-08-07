import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connection successfull");
  } catch (error) {
    console.log("Error in database connection: ", error);
  }
};
