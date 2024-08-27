import { sendError, sendSuccessResponse } from "../utils/ApiResponse.js";
import { postLikeAdded, postLikeRemove } from "../services/postLikeSeravice.js";
import mongoose from "mongoose";
import postModel from "../models/postModel.js";


const likePost = async (req, res) => {
  const { postId } = req.body;
  const likedBy = req?.user?._id + "";
  const name = req?.user?.name;

  if (!postId) {
    return sendError('Post ID are required', req, res, 400);
  }

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return sendError('Invalid postId format', req, res, 400);
  }

  try {
    const postExists = await postModel.findById(postId);
    if (!postExists) {
      return sendError('Invalid postId: Post does not exist', req, res, 400);
    }
    const newLike = await postLikeAdded({ postId, likedBy, name });
    return sendSuccessResponse(req, res, newLike, newLike?.length);

  } catch (error) {
    console.log(error);
    return sendError(error, req, res, 400);
  }
};

const unLikePost = async (req, res) => {
  const { postId } = req.body;
  const likedBy = req?.user?._id + "";

  if (!postId) {
    return sendError('Post ID are required', req, res, 400);
  }

  try {
    const unLike = await postLikeRemove({ postId, likedBy });
    return sendSuccessResponse(req, res, unLike, unLike?.length);
  } catch (error) {
    console.log(error);
    return sendError(error, req, res, 400);
  }
};

export default {
  likePost,
  unLikePost
};
