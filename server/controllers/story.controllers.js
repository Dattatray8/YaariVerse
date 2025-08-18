import User from "../models/user.model.js";
import Story from "../models/story.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const uploadStory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.story) {
      await Story.findByIdAndDelete(user.story);
      user.story = null;
    }
    const { mediaType } = req.body;
    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ success: false, message: "Upload media" });
    }
    const story = await Story.create({
      author: req.userId,
      media,
      mediaType,
    });
    user.story = story._id;
    await user.save();
    const populatedStory = await Story.findById(story._id)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");
    return res.status(201).json({
      success: true,
      message: "Story created successfully",
      populatedStory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Uploading Story",
      error: error.message,
    });
  }
};

export const viewStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const story = await Story.findById(storyId);
    if (!story) {
      return res
        .status(400)
        .json({ success: false, message: "Story not found" });
    }
    const viewersIds = story.viewers.map((id) => id.toString());
    if (!viewersIds.includes(req.userId.toString())) {
      story.viewers.push(req.userId);
      await story.save();
    }
    const populatedStory = await Story.findById(story._id)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");
    return res.status(200).json({
      success: true,
      message: "Story viewed successfully",
      populatedStory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error to View Story",
      error: error.message,
    });
  }
};

export const getStoryByUserName = async (req, res) => {
  try {
    const userName = req.params.userName;
    const user = await User.findOne({ userName });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const story = await Story.findOne({ author: user._id }).populate(
      "viewers author"
    );

    if (!story) {
      if (user.story) {
        user.story = null;
        await user.save();
      }

      return res.status(200).json({
        success: true,
        message: "No active story",
        story: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Story fetched successfully",
      story,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error to Get Story",
      error: error.message,
    });
  }
};

export const getAllStories = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const followingIds = currentUser.following;
    const stories = await Story.find({
      author: { $in: followingIds },
    })
      .populate("viewers author")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All Story get successfully",
      stories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error to Get All Stories",
      error: error.message,
    });
  }
};
