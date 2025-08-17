import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.mode.js";
import Message from "../models/messages.model.js";

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
    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .populate("participants")
      .sort({ updatedAt: -1 });
      const userMap = {}
    conversations.forEach((conv)=> {
        conv.participants.forEach(user=>{
            if(user._id !==currentUserId){
                userMap(user._id)=user
            }
        })
    })
    const prevUsers = Object.values(userMap);
    return res.status(200).json(prevUsers);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error to get prev chat",
      error: error.message,
    });
  }
};
