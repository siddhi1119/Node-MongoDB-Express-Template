import { sendError, sendSuccessResponse } from "../utils/ApiResponse.js";
import { commentDelete, getAllComments, postCommentAdded } from "../services/postCommentService.js";
import postCommentsModel from "../models/postComment.js";

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

const fetchAllcomments = async (req, res) => {
  try {
    const { postId, page, limit } = req.query; 
    const allComments = await getAllComments({ postId, page, limit }); 
    return sendSuccessResponse(req, res, allComments, allComments?.length);
  } catch (error) {      
    return sendError(error, req, res, 400);
  }
};

const deleteComment = async (req,res) => {
  const { commentId  } = req.body;
  const commentBy = req?.user?._id + "";

  if (!commentId) {
    return sendError('commentId is required', req, res, 400);
  }  
  try {
    const comment = await postCommentsModel.findOne({_id:commentId})

    if(!comment){
      return sendError('Comment not found', req, res, 404);
    }

    if(comment.commentBy.toString() !== commentBy.toString()){
      return sendError('Not authorized to delete this comment', req, res, 403);
    }

    const deletedComment = await commentDelete(commentBy,commentId);  
    return sendSuccessResponse(req, res, deletedComment);
  } catch (error) {
    console.log(error);
    return sendError('Failed to delete comment', req, res, 400);
  }
}


export default {
  commentPost,
  fetchAllcomments,
  deleteComment
};
