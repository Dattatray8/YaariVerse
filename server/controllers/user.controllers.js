import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import { getSocketId, io } from "../socket.js";
import { sendPushNotification } from "../config/firebase.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate(
      "posts shorts posts.author posts.comments following"
    );
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User found successfully", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in finding current user", error: error.message });
  }
};

export const suggestedUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select(
      "-password"
    );
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Error in finding suggested users",
      error: error.message,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name, userName, bio, profession } = req.body;
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }
    const sameUser = await User.findOne({ userName }).select("-password");
    if (sameUser && !sameUser._id.equals(req.userId)) {
      return res
        .status(400)
        .json({ success: false, message: "UserName is exists" });
    }
    let profileImage;
    if (req.file) {
      profileImage = await uploadOnCloudinary(req.file.path);
    } else {
      profileImage = user.profileImage;
    }
    user.name = name;
    user.userName = userName;
    user.bio = bio;
    user.profession = profession;
    user.profileImage = profileImage;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Profile successfully edited", user });
  } catch (error) {
    return res.status(500).json({
      message: "Error in editing profile",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userName = req.params.userName;
    const user = await User.findOne({ userName })
      .select("-password")
      .populate("posts shorts followers following saved");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Profile fetched successfully", user });
  } catch (error) {
    return res.status(500).json({
      message: "Error in get profile",
      error: error.message,
    });
  }
};

export const follow = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const targetUserId = req.params.targetUserId;
    if (!targetUserId) {
      return res.status(400).json({ message: "Target user is not found" });
    }
    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);
    const isFollowing = currentUser.following.includes(targetUserId);
    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId
      );
      await currentUser.save();
      await targetUser.save();
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      if (currentUser._id != targetUser._id) {
        const notification = await Notification.create({
          sender: currentUser._id,
          receiver: targetUser._id,
          type: "follow",
          message: "started following you",
        });
        const populatedNotification = await Notification.findById(
          notification?._id
        ).populate("sender receiver");
        const receiverSocketId = getSocketId(targetUser._id);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "newNotification",
            populatedNotification
          );
        }
        if (targetUser?.fcmToken) {
          try {
            await sendPushNotification(
              targetUser.fcmToken,
              "New Follow",
              `${currentUser.name} started following you`,
              currentUser?.profileImage
            );
          } catch (error) {
            console.error("Failed to send push notification:", error);
          }
        }
      }
      await currentUser.save();
      await targetUser.save();
    }
    return res.status(200).json({
      following: currentUser.following.map((id) => id.toString()),
      message: isFollowing ? "Unfollowed" : "Followed",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in get profile",
      error: error.message,
    });
  }
};

export const followingList = async (req, res) => {
  try {
    const result = await User.findById(req.userId);
    return res.status(200).json(result?.following);
  } catch (error) {
    return res.status(500).json({
      message: "Error in getting following list",
      error: error.message,
    });
  }
};

export const search = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    if (!keyword) {
      res.status(400).json({ message: "keyword is required" });
    }

    const users = await User.find({
      _id: { $ne: req.userId },
      $or: [
        { userName: { $regex: keyword, $options: "i" } },
        { name: { $regex: keyword, $options: "i" } },
      ],
    }).select("-password");

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({
      message: "Error in to search user",
      error: error.message,
    });
  }
};

export const getAllNotfications = async (req, res) => {
  try {
    const notfications = await Notification.find({
      receiver: req.userId,
    })
      .populate("sender receiver post short")
      .sort({ createdAt: -1 });
    res.status(200).json(notfications);
  } catch (error) {
    return res.status(500).json({
      message: "Error to get all notfication",
      error: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    if (Array.isArray(notificationId)) {
      await Notification.updateMany(
        {
          _id: { $in: notificationId },
          receiver: req.userId,
        },
        {
          $set: { isRead: true },
        }
      );
    } else {
      await Notification.findOneAndUpdate(
        {
          _id: { $in: notificationId },
          receiver: req.userId,
        },
        {
          $set: { isRead: true },
        }
      );
    }
    return res.status(200).json({ message: "Notificatio is marked as read" });
  } catch (error) {
    return res.status(500).json({
      message: "Error to marking as read",
      error: error.message,
    });
  }
};

export const updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }
    await user.updateOne({ fcmToken: fcmToken });
    await user.save();
    return res.status(200).json({ message: "FCM token updated successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error to set fcm token",
      error: error.message,
    });
  }
};
