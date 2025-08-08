import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../config/token.js";

export const signUp = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;
    const findUserEmail = User.findOne({ email });
    if (findUserEmail) {
      return res
        .status(400)
        .json({ sucess: false, message: "This email user already exists!" });
    }
    const findUsersUserName = User.findOne({ userName });
    if (findUsersUserName) {
      return res
        .status(400)
        .json({ sucess: false, message: "Username already exists" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({
          message: false,
          message: "Password must be atleast 6 characters.",
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.create({
      name,
      userName,
      email,
      password: hashedPassword,
    });
    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "Strict",
    });
    return res
      .status(201)
      .json({ sucess: true, message: "User created Successfully" });
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Failed to SignUp",
      error: error.message,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const findUsersUserName = User.findOne({ userName });
    if (!findUsersUserName) {
      return res
        .status(400)
        .json({ sucess: false, message: "User not exists" });
    }
    const passwordMatch = bcrypt.compare(password, findUsersUserName.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ sucess: false, message: "Incorrect Password" });
    }
    const token = await generateToken(findUsersUserName._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "Strict",
    });
    return res
      .status(200)
      .json({ sucess: true, message: "User Login Successfully" });
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Failed to SignIn",
      error: error.message,
    });
  }
};
