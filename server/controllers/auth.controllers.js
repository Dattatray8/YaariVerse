import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/token.js";
import sendMail from "../config/mail.js";

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
      secure: true,
      sameSite: "none",
    });
    return res
      .status(201)
      .json({ suscess: true, message: "User created Successfully", user });
  } catch (error) {
    return res.status(500).json({
      success: false,
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
        .json({ success: false, message: "Inavlid username or password" });
    }
    const passwordMatch = await bcrypt.compare(
      password,
      findUsersUserName.password
    );
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid username or password" });
    }
    const token = await generateToken(findUsersUserName._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({
      success: true,
      message: "User Login Successfully",
      findUsersUserName,
    });
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

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not exists" });
    }
    const otp = Math.floor(1000 * Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();
    await sendMail(email, otp);
    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Send OTP",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid/Expired OTP" });
    }
    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Verify OTP",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res
        .status(400)
        .json({ success: false, message: "OTP verification required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Reset Password",
      error: error.message,
    });
  }
};
