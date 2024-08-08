import mongoose from "mongoose";
import Blog from "../models/BlogModel.js";
import Comment from "../models/CommentModel.js";
import deleteCommentUtil from "../utils/deleteCommentUtil.js";

export const addComment = async (req, res) => {
  const { userId, blogId, description } = req.body;

  // console.log(userId, blogId, description);

  if (!mongoose.isValidObjectId(blogId)) {
    return res.status(404).json({
      message: "Error! Attempting to save to an invalid blog id",
    });
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return res.status(404).json({
      message: "Error! Can't find blog parent!",
    });
  }

  if (!description) {
    return res.status(404).json({
      message: "Error! Invalid input: description",
    });
  }

  try {
    const newComment = new Comment({
      userId,
      blogId,
      description,
    });
    const savedComment = await newComment.save();

    await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { comments: savedComment._id },
      },
      { new: true }
    );

    const populatedComment = await Comment.findById(savedComment._id)
      .populate("userId", "firstName lastName image")
      .exec();

    return res.status(200).json(populatedComment);
  } catch (error) {
    return res.status(400).json({
      message: "Error! Having trouble saving comment!",
    });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate("user", "name image role");

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({
      message: "Error! Can't get the comments",
      error: error.message,
    });
  }
};

export const getOneComment = async (req, res) => {
  const id = req.body.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({
      message: "Error! Attempting to fetch to an invalid comment id",
    });
  }

  try {
    const comment = await Comment.findById(id).populate(
      "user",
      "name image role"
    );

    return res.status(200).json(comment);
  } catch (error) {
    return res.status(404).json({
      message: "Error! Comment not found!",
      error: error.message,
    });
  }
};

export const getManyComments = async (req, res) => {
  const allComments = req.body.array;

  if (!allComments) {
    return res.status(400).json({
      message: "Error! Comments not provided.",
    });
  }

  try {
    const returnedArray = [];

    for (let i = 0; i < allComments.length; i++) {
      const commentId = allComments[i]; // Assuming each item in allComments is a comment ID
      const comment = await Comment.findById(commentId);

      if (comment) {
        returnedArray.push(comment);
      }
    }

    return res.status(200).json(returnedArray);
  } catch (error) {
    return res.status(404).json({
      message: "Error! Comment not found!",
      error: error.message,
    });
  }
};

export const updateComment = async (req, res) => {
  const { description, id } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({
      message: "Error! Attempting to update to an invalid comment id",
    });
  }

  try {
    await Comment.findByIdAndUpdate(
      id,
      {
        $set: {
          description,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Comment updated successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error! Can't update comment",
      error: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId, blogId } = req.body;

  if (
    !mongoose.isValidObjectId(commentId) ||
    !mongoose.isValidObjectId(blogId)
  ) {
    return res.status(404).json({
      message: "Error! Invalid comment or blog ID",
    });
  }

  try {
    // Delete the comment
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({
        message: "Error! Can't find comment to delete",
      });
    }

    // Update the blog by removing the comment ID from its comments array
    const updateResult = await Blog.updateOne(
      { _id: blogId },
      { $pull: { comments: commentId } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({
        message: "Error! Blog not found or comment not in the blog",
      });
    }

    return res.status(200).json({
      message: "Comment has been deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error! Can't delete comment",
      error: error.message,
    });
  }
};

export const addReply = async (req, res) => {
  const { name, description, id } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({
      message: "Error! Attempting to reply to an invalid comment id",
    });
  }

  if (!name || !description) {
    return res.status(404).json({
      message: "Error! Invalid input: name or description",
    });
  }

  const comment = await Comment.findById(id);

  if (!comment) {
    return res.status(404).json({
      message: "Error! Can't find comment parent!",
    });
  }

  try {
    const newReply = await Comment.create({
      name,
      description,
      replies: [],
      type: "reply",
      parent: id,
    });
    const savedReply = await newReply.save();

    await Comment.findByIdAndUpdate(
      id,
      {
        $set: {
          replies: [...comment.replies, savedReply._id],
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Reply created successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error! Having trouble saving reply!",
      error: error.message,
    });
  }
};

//////////////////////////////////////////////////////////////////////////

export const deleteAll = async (req, res) => {
  try {
    const result = await Comment.deleteMany({});

    return res.status(200).json({
      message: "Deleted All rows successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error! Can't delete all rows",
      error: error.message,
    });
  }
};
