import { sendError, sendSuccessResponse } from "../utils/ApiResponse.js";
import { postLikeAdded, postLikeRemove } from "../services/postLikeSeravice.js";

const likePost = async (req, res) => {
  const { postId } = req.body;
  const likedBy = req?.user?._id + "";
  const name = req?.user?.name;
  
  if (!postId) {
    return sendError('Post ID are required', req, res, 400);
  }

  try {
    const newLike = await postLikeAdded({postId, likedBy, name});
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
    const unLike = await postLikeRemove({postId, likedBy});
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
