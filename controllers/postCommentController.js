import { sendError, sendSuccessResponse } from "../utils/ApiResponse.js";
import { postCommentAdded } from "../services/postCommentService.js";

const commentPost = async (req, res) => {
  const { content, postId } = req.body;
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

export default {
  commentPost,
};
