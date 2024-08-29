import { sendError, sendSuccessResponse } from "../utils/ApiResponse.js";
import { addReplyToComment, commentDelete, editCommentOrReply, getAllComments, postCommentAdded } from "../services/postCommentService.js";
import CommentsReplyModel from "../models/replyComment.js";
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
    const { id: postId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const allComments = await getAllComments({ postId: mongoose.Types.ObjectId(postId), page, limit });
    return sendSuccessResponse(req, res, allComments, allComments?.length);
  } catch (error) {
    console.log(error);
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
    const editedComment = await editCommentOrReply(postCommentsModel, commentBy, commentId, updatedContent);
    return sendSuccessResponse(req, res, editedComment);
  } catch (error) {
    return sendError(error.message, req, res, 400);
  }
}

const replyToComment = async (req, res) => {
  const {  id:parentCommentId } = req.params;
  const { content, postId } = req.body;
  const commentBy = req?.user?._id + "";
  try {
    const savedReply = await addReplyToComment(parentCommentId, postId, commentBy, content);
    return sendSuccessResponse(req, res, savedReply);
  } catch (error) {
    return sendError(error.message, req, res, 400);
  }
}

const editReplyComment = async (req, res) => {
  const { id: commentId } = req.params;
  const { updatedContent } = req.body;
  const commentBy = req?.user?._id + "";

  try {
    const editedComment = await editCommentOrReply(CommentsReplyModel, commentBy, commentId, updatedContent);
    return sendSuccessResponse(req, res, editedComment);
  } catch (error) {
    return sendError(error.message, req, res, 400);
  }
}

const deleteReplyComment = async (req, res) => {
  const { id:commentId } = req.params;
  const commentBy = req?.user?._id + "";
  try {
    const deletedComment = await commentDelete(CommentsReplyModel, commentBy, commentId);
    return sendSuccessResponse(req, res, deletedComment);
  } catch (error) {
    console.log(error);
    return sendError(error.message, req, res, 400);
  }
}

export default {
  commentPost,
  fetchAllcomments,
  deleteComment,
  editComment,
  replyToComment,
  editReplyComment,
  deleteReplyComment
};
