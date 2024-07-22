import Comment from '../models/CommentModel.js';

const deleteCommentUtil = async (commentId) => {
    try {
        let comment = await Comment.findById(commentId);

        if (!comment) {
            // return res.status(404).json({
            //     message: "Comment not found",
            // });
            console.log(1)
        }

        if (comment.replies.length === 0) {
            await Comment.findByIdAndDelete(commentId);
            // return res.status(200).json({
            //     message: "Comment deleted successfully",
            // });
            console.log(2)

        }

        for (let i = 0; i < comment.replies.length; i++) {
            await deleteCommentUtil(comment.replies[i]);
        }

        await Comment.findByIdAndDelete(commentId);
        // return res.status(200).json({
        //     message: "Comment deleted recursively successfully",
        // });
    } catch (error) {
        // return res.status(500).json({
        //     message: "Error! Server Error deleting comments recursively",
        //     error: error.message,
        // });
        console.log("error recursively deleting: ", error.message);
    }
};

export default deleteCommentUtil;
