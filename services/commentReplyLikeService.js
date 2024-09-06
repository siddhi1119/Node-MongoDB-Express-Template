import commentReplyLikesModel from "../models/commentReplyLike.js";
import CommentsReplyModel from "../models/replyComment.js";
import { sendError, sendSuccessResponse } from "../utils/ApiResponse.js";

const commentReplyLikeAdded = async({commentId,likedBy,name})=>{  
  
    const isAlreadyLikedComment = await commentReplyLikesModel.findOne({commentId,likedBy}).lean();
    if (!isAlreadyLikedComment) {
        const newCommentLike = await commentReplyLikesModel.create({
          commentId,
          likedBy,
          name
        });
        return newCommentLike;
      }   else {
        return sendError(error, req, res, 200);
      }   
}

const commentReplyLikeRemove = async({id,likedBy})=>{    
  const disLikePost = await commentReplyLikesModel.deleteOne({id,likedBy}).lean();  
  return disLikePost;
}


const getAllReplyComments = async ({ postId, page = 1, limit = 10 }) => {
  let matchConditions = {};

  if (postId) {
    matchConditions.postId = postId; 
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const comments = CommentsReplyModel.aggregate([
    {
      $match: matchConditions,
    },
    {
      $lookup: {
        from: "commentreplylikes",
        localField: "_id",
        foreignField: "commentId",
        as: "likes",
        pipeline: [
          {
            $project: {
              _id: 1,
              likedBy: 1,
            },
          },
        ],
      },
    },   
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        likeBy: { $map: { input: "$likes", as: "like", in: "$$like.likedBy" } },        
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $project: {
        content: 1,
        postId: 1,
        commentBy: 1,        
        name: 1,
        likeCount: 1,
        likeBy: 1,
        createdAt: 1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: parseInt(limit),
    },
  ]);
  return comments;
};

export {  
    commentReplyLikeAdded,
    commentReplyLikeRemove,
    getAllReplyComments    
  };