import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/token.js";

export const signUp = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;
    const findUserEmail = await User.findOne({ email });
    if (findUserEmail) {
      return res
        .status(400)
        .json({ success: false, message: "This email user already exists!" });
    }
    const findUsersUserName = await User.findOne({ userName });
    if (findUsersUserName) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be atleast 6 characters.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
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
      .json({ suscess: true, message: "User created Successfully" });
  } catch (error) {
    return res.status(500).json({
      sucsess: false,
      message: "Failed to SignUp",
      error: error.message,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const findUsersUserName = await User.findOne({ userName });
    if (!findUsersUserName) {
      return res
        .status(400)
        .json({ success: false, message: "User not exists" });
    }
    const passwordMatch = bcrypt.compare(password, findUsersUserName.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Password" });
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
      .json({ success: true, message: "User Login Successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to SignIn",
      error: error.message,
    });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json({ success: true, message: "Sign out successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to SignOut",
      error: error.message,
    });
  }
};
