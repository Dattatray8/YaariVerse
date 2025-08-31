import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import ShortVerse from "../models/shortVerse.model.js";
import { getSocketId, io } from "../socket.js";
import Notification from "../models/notification.model.js";
import { sendPushNotification } from "../config/firebase.js";

export const uploadShort = async (req, res) => {
  try {
    const { caption } = req.body;
    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    }
    const short = await ShortVerse.create({
      caption,
      media,
      author: req.userId,
    });
    const user = await User.findById(req.userId);
    user.shorts.push(short);
    user.save();
    const populatedShort = await ShortVerse.findById(short._id).populate(
      "author",
      "name userName profileImage"
    );
    return res.status(201).json({
      success: true,
      message: "Short created successfully",
      populatedShort,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in uploading Short",
      error: error.message,
    });
  }
};

export const like = async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const short = await ShortVerse.findById(shortId);
    if (!short) {
      return res
        .status(400)
        .json({ success: true, message: "Short not found" });
    }
    const alreadyLiked = short.likes.some(
      (id) => id.toString() === req.userId.toString()
    );
    if (alreadyLiked) {
      short.likes = short.likes.filter(
        (id) => id.toString() !== req.userId.toString()
      );
    } else {
      short.likes.push(req.userId);
      if (short?.author?._id != req.userId) {
        const notification = await Notification.create({
          sender: req.userId,
          receiver: short?.author?._id,
          type: "like",
          short: short?._id,
          message: "liked your short",
        });
        const populatedNotification = await Notification.findById(
          notification?._id
        ).populate("sender receiver short");
        const receiverSocketId = getSocketId(short?.author?._id);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "newNotification",
            populatedNotification
          );
        }
        const targetUser = await User.findById(short?.author?._id);
        const currentUser = await User.findById(req.userId);
        if (targetUser?.fcmToken) {
          try {
            await sendPushNotification(
              targetUser.fcmToken,
              "New like",
              `${currentUser?.name} liked your short`,
              currentUser?.profileImage
            );
          } catch (error) {
            console.error("Failed to send push notification:", error);
          }
        }
      }
    }
    await short.save();
    await short.populate("author", "name userName profileImage");

    io.emit("likedShort", {
      shortId: short?._id,
      likes: short?.likes,
    });

    return res
      .status(200)
      .json({ success: true, message: "Short liked successfully", short });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in liking short",
      error: error.message,
    });
  }
};

export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const shortId = req.params.shortId;
    const short = await ShortVerse.findById(shortId);
    if (!short) {
      return res
        .status(400)
        .json({ success: true, message: "Short not found" });
    }
    short.comments.push({
      author: req.userId,
      message,
    });
    if (short?.author?._id != req.userId) {
      const notification = await Notification.create({
        sender: req.userId,
        receiver: short?.author?._id,
        type: "comment",
        short: short?._id,
        message: "commented on your short",
      });
      const populatedNotification = await Notification.findById(
        notification?._id
      ).populate("sender receiver short");
      const receiverSocketId = getSocketId(short?.author?._id);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
      }
      const targetUser = await User.findById(short?.author?._id);
      const currentUser = await User.findById(req.userId);
      if (targetUser?.fcmToken) {
        try {
          await sendPushNotification(
            targetUser.fcmToken,
            "New Comment",
            `${currentUser?.name} commented your short`,
            currentUser?.profileImage
          );
        } catch (error) {
          console.error("Failed to send push notification:", error);
        }
      }
    }
    await short.save();
    await short.populate("author", "name userName profileImage");
    await short.populate("comments.author");

    io.emit("commentedShort", {
      shortId: short?._id,
      comments: short?.comments,
    });

    return res
      .status(200)
      .json({ success: true, message: "Short comment successfull", short });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in commenting Short",
      error: error.message,
    });
  }
};

export const getAllShorts = async (req, res) => {
  try {
    const shorts = await ShortVerse.find({})
      .populate("author", "name userName profileImage")
      .populate("comments.author")
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ success: true, message: "Shorts get successfully", shorts });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in getting all shorts",
      error: error.message,
    });
  }
};
