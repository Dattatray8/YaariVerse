import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.mode.js";
import Message from "../models/messages.model.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const { message } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      image,
    });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    const receiverSocketId = getSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      message: "Message send successfully",
      newMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error to send message",
      error: error.message,
    });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");
    return res.status(200).json(conversation?.messages);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error to get messages",
      error: error.message,
    });
  }
};

export const getPrevUserChat = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const currentUser = await User.findById(currentUserId).select("-password");
    const conversations = await Conversation.find({
      participants: { $in: currentUserId },
    })
      .populate("participants", "_id userName profileImage") 
      .sort({ updatedAt: -1 }); 

    const userMap = []; 
    conversations.forEach((conv) => {
      conv.participants.forEach((user) => {
        if (user._id.toString() !== currentUserId && !currentUser?.following.includes(user?._id)) {
          userMap.push(user);
        }
      });
    });

    return res.status(200).json({ success: true, users: userMap });
  } catch (error) {
    console.error("Error in getPrevUserChat:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching previous chat users",
      error: error.message,
    });
  }
};