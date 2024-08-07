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

    return res.status(200).json({
      message: "Comment created successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error! Having trouble saving comment!",
    });
  }
};

// export const addComment = async (req, res) => {
//   const { name, description, id } = req.body;

//   console.log(name, description, id);

//   if (!mongoose.isValidObjectId(id)) {
//     return res.status(404).json({
//       message: "Error! Attempting to save to an invalid blog id",
//     });
//   }

//   const blog = await Blog.findById(id);

//   if (!blog) {
//     return res.status(404).json({
//       message: "Error! Can't find blog parent!",
//     });
//   }

//   if (!name || !description) {
//     return res.status(404).json({
//       message: "Error! Invalid input: name or description",
//     });
//   }

//   try {
//     const newComment = await Comment.create({
//       name,
//       description,
//       // type: "comment",
//       // replies: [],
//       // parent: id,
//     });
//     const savedComment = await newComment.save();

//     await Blog.findByIdAndUpdate(
//       id,
//       {
//         $set: {
//           comments: [...blog.comments, savedComment._id],
//         },
//       },
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Comment created successfully!",
//     });
//   } catch (error) {
//     return res.status(400).json({
//       message: "Error! Having trouble saving comment!",
//     });
//   }
// };

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();

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
    const comment = await Comment.findById(id).populate("user", "name image");

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
  const id = req.body.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({
      message: "Error! Attempting to delete to an invalid comment id",
    });
  }

  try {
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({
        message: "Error! Can't find comment to delete",
      });
    }

    //handle deleting comment reference in parent element
    switch (deletedComment.type) {
      case "comment": {
        const blog = await Blog.findById(deletedComment.parent);
        let prevArray = blog.comments;
        prevArray = prevArray.filter(
          (item) => item.toString() != deletedComment._id.toString()
        );
        await Blog.findByIdAndUpdate(
          deletedComment.parent,
          {
            $set: {
              comments: prevArray,
            },
          },
          { new: false }
        );
        break;
      }
      case "reply": {
        const comment = await Comment.findById(deletedComment.parent);
        let prevArray = comment.replies;
        prevArray = prevArray.filter(
          (item) => item.toString() != deletedComment._id.toString()
        );
        await Comment.findByIdAndUpdate(
          deletedComment.parent,
          {
            $set: {
              replies: prevArray,
            },
          },
          { new: false }
        );
        break;
      }
      default: {
        return res.status(500).json({
          message: "Error! cannot specify comment type!",
        });
      }
    }

    //delete all children comments
    if (deletedComment.replies && deletedComment.replies.length > 0) {
      // for(let i=0; i < deletedComment.replies.length; i++){
      //     await Comment.findByIdAndDelete(deletedComment.replies[i], res);
      // }
      for (let i = 0; i < deletedComment.replies.length; i++) {
        deleteCommentUtil(deletedComment.replies[i]);
      }
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
