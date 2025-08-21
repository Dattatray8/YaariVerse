import Post from "../models/post.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js";
import Notification from "../models/notification.model.js";

export const uploadPost = async (req, res) => {
  try {
    const { mediaType, caption } = req.body;
    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    }
    const post = await Post.create({
      caption,
      media,
      mediaType,
      author: req.userId,
    });
    const user = await User.findById(req.userId);
    user.posts.push(post);
    user.save();
    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name userName profileImage"
    );
    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      populatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in uploading post",
      error: error.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("author", "name userName profileImage")
      .populate("comments.author", "name userName profileImage")
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ success: true, message: "Posts get successfully", posts });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in getting all posts",
      error: error.message,
    });
  }
};

export const like = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: "Post not found" });
    }
    const alreadyLiked = post.likes.some(
      (id) => id.toString() === req.userId.toString()
    );
    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.userId.toString()
      );
    } else {
      post.likes.push(req.userId);
      if (post?.author?._id != req.userId) {
        const notification = await Notification.create({
          sender: req.userId,
          receiver: post?.author?._id,
          type: "like",
          post: post?._id,
          message: "liked your post",
        });
        const populatedNotification = await Notification.findById(
          notification?._id
        ).populate("sender receiver post");
        const receiverSocketId = getSocketId(post?.author?._id);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "newNotification",
            populatedNotification
          );
        }
      }
    }
    await post.save();
    await post.populate("author", "name userName profileImage");

    io.emit("likedPost", {
      postId: post?._id,
      likes: post?.likes,
    });

    return res
      .status(200)
      .json({ success: true, message: "Posts liked successfully", post });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in liking posts",
      error: error.message,
    });
  }
};

export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: "Post not found" });
    }
    post.comments.push({
      author: req.userId,
      message,
    });
    if (post?.author?._id != req.userId) {
      const notification = await Notification.create({
        sender: req.userId,
        receiver: post?.author?._id,
        type: "comment",
        post: post?._id,
        message: "commented on your post",
      });
      const populatedNotification = await Notification.findById(
        notification?._id
      ).populate("sender receiver post");
      const receiverSocketId = getSocketId(post?.author?._id);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
      }
    }

    await post.save();
    await post.populate("author", "name userName profileImage");
    await post.populate("comments.author", "name userName profileImage");

    io.emit("commentedPost", {
      postId: post?._id,
      comments: post?.comments,
    });

    return res
      .status(200)
      .json({ success: true, message: "Posts comment successfull", post });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in commenting posts",
      error: error.message,
    });
  }
};

export const saved = async (req, res) => {
  try {
    const postId = req.params.postId;
    const user = await User.findById(req.userId);
    const alreadySaved = user.saved.some(
      (id) => id.toString() === postId.toString()
    );
    if (alreadySaved) {
      user.saved = user.saved.filter(
        (id) => id.toString() !== postId.toString()
      );
    } else {
      user.saved.push(postId);
    }
    await user.save();
    // await user.populate("saved");
    return res
      .status(200)
      .json({ success: true, message: "Posts Saved Successfully", user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in saving posts",
      error: error.message,
    });
  }
};
