import mongoose from "mongoose";
import postCommentsModel from "../models/postComment.js";
import { commentLikeAdded, commentLikeRemove } from "../services/commentLikeService.js";
import { sendError, sendSuccessResponse } from "../utils/ApiResponse.js";

const likeComment = async (req, res) => {
  
  const { id : commentId } = req.params;
  const likedBy = req?.user?._id + "";
  const name = req?.user?.name;

  if (!commentId) {
    return sendError('commentId are required', req, res, 400);
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return sendError('Invalid commentId format', req, res, 400);
  }

  try {
    const commentExists = await postCommentsModel.findById(commentId);
    if (!commentExists) {
      return sendError('Invalid commentId: Comment does not exist', req, res, 400);
    }

    const newCommentLike = await commentLikeAdded({ commentId, likedBy, name });
    if (newCommentLike) {
      return sendSuccessResponse(req, res, newCommentLike);
    }
  } catch (error) {
    console.log(error);
    return sendError(error, req, res, 400);
  }
};

const unLikeComment = async (req, res) => {
  
  const { id : commentId } = req.params;
  const likedBy = req?.user?._id + "";

  if (!commentId) {
    return sendError('commentId are required', req, res, 400);
  }

  try {
    const disLikeComment = await commentLikeRemove({ commentId, likedBy });
    return sendSuccessResponse(req, res, disLikeComment);
  } catch (error) {
    console.log(error);
    return sendError(error, req, res, 400);
  }
};

export default {
  likeComment,
  unLikeComment
};
