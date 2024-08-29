import mongoose from "mongoose";
import { sendError, sendSuccessResponse } from "../utils/ApiResponse.js";
import { commentReplyLikeAdded, commentReplyLikeRemove, getAllReplyComments } from "../services/commentReplyLikeService.js";
import CommentsReplyModel from "../models/replyComment.js";

const likeReplyComment = async (req, res) => {
  const { commentId } = req.query;
  const likedBy = req?.user?._id + "";
  const name = req?.user?.name;

  if (!commentId) {
    return sendError('commentId are required', req, res, 400);
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return sendError('Invalid commentId format', req, res, 400);
  }

  try {
    const commentExists = await CommentsReplyModel.findById(commentId);
    if (!commentExists) {
      return sendError('Invalid commentId: Comment does not exist', req, res, 400);
    }

    const newCommentLike = await commentReplyLikeAdded({ commentId, likedBy, name });
    if (newCommentLike) {
      return sendSuccessResponse(req, res, newCommentLike);
    }
  } catch (error) {
    console.log(error);
    return sendError(error, req, res, 400);
  }
};

const unLikeReplyComment = async (req, res) => {
  const { id } = req.params;
  const likedBy = req?.user?._id + "";

  if (!id) {
    return sendError('commentId are required', req, res, 400);
  }

  try {
    const disLikeComment = await commentReplyLikeRemove({ id, likedBy });
    return sendSuccessResponse(req, res, disLikeComment);
  } catch (error) {
    console.log(error);
    return sendError(error, req, res, 400);
  }
};

const fetchReplyComment = async (req, res) => {
  try {
    const { id: postId } = req.params;  
    const { page = 1 , limit = 10 } = req.query;    
    const allComments = await getAllReplyComments({ postId: mongoose.Types.ObjectId(postId), page, limit });
    return sendSuccessResponse(req, res, allComments, allComments?.length);
  } catch (error) {
    console.log(error);
    return sendError(error, req, res, 400);
  }
};

export default {
  likeReplyComment,
  unLikeReplyComment,
  fetchReplyComment
};
