import { sendError, sendSuccessResponse } from "../utils/ApiResponse.js";
import { addReplyToComment, commentDelete, commentEdit, getAllComments, postCommentAdded } from "../services/postCommentService.js";
import postCommentsModel from "../models/postComment.js";

const commentPost = async (req, res) => {
  const { content } = req.body;
  const { postId } = req.query;
  const commentBy = req?.user?._id + "";
  const name = req?.user?.name;

  try {
    const newComment = await postCommentAdded(content, postId, commentBy, name);
    return sendSuccessResponse(req, res, newComment, newComment?.length);
  } catch (error) {
    console.log(error);
    return sendError(error, req, res, 400);
  }
};

const fetchAllcomments = async (req, res) => {
  try {
    const { postId, page, limit } = req.query;
    const allComments = await getAllComments({ postId, page, limit });
    return sendSuccessResponse(req, res, allComments, allComments?.length);
  } catch (error) {
    return sendError(error, req, res, 400);
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.query;
  const commentBy = req?.user?._id + "";
  try {
    const deletedComment = await commentDelete(commentBy, commentId);
    return sendSuccessResponse(req, res, deletedComment);
  } catch (error) {
    console.log(error);
    return sendError(error.message, req, res, 400);
  }
}

const editComment = async (req, res) => {
  const { commentId } = req.query;
  const { updatedContent } = req.body;
  const commentBy = req?.user?._id + "";

  try {
    const editedComment = await commentEdit(commentBy, commentId, updatedContent);
    return sendSuccessResponse(req, res, editedComment);
  } catch (error) {
    return sendError(error.message, req, res, 400);
  }
}

const replyToComment = async (req, res) => {
  const { parentCommentId } = req.query;
  const { content, postId } = req.body;
  const commentBy = req?.user?._id + "";
  try {
    const savedReply = await addReplyToComment(parentCommentId,postId, commentBy, content);
    return sendSuccessResponse(req, res, savedReply);
  } catch (error) {
    return sendError(error.message, req, res, 400);
  }
}
export default {
  commentPost,
  fetchAllcomments,
  deleteComment,
  editComment,
  replyToComment
};
