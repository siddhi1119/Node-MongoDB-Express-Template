import commentLikesModel from "../models/commentLikes.js";
import { sendError, sendSuccessResponse } from "../utils/ApiResponse.js";

const commentLikeAdded = async({commentId,likedBy,name})=>{  
    const isAlreadyLikedComment = await commentLikesModel.findOne({commentId,likedBy}).lean();
    if (!isAlreadyLikedComment) {
        const newCommentLike = await commentLikesModel.create({
          commentId,
          likedBy,
          name
        });
        return newCommentLike;
      }   else {
        return sendError(error, req, res, 200);
      }   
}

const commentLikeRemove = async({commentId,likedBy})=>{    
  const disLikePost = await commentLikesModel.findByIdAndDelete({commentId,likedBy}).lean();  
  return disLikePost;
}


export {  
    commentLikeAdded,
    commentLikeRemove    
  };