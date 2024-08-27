import postCommentsModel from "../models/postComment.js";
import postModel from "../models/postModel.js";

const postCommentAdded = async (content, postId, commentBy, name) => {
  const addComment = await postCommentsModel.create({
    content,
    commentBy,
    name,
    postId,
  });
  return addComment;
};

const getAllComments = async ({ postId,page = 1, limit = 10}) => {  
  let matchConditions = {};

  if (postId) {
    matchConditions.postId = postId; // Filter by postId if provided
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const comments = postCommentsModel.aggregate([
    {
      $match: matchConditions,
    },
    {
      $lookup: {
        from: "commentlikes",
        localField: "_id",
        foreignField: "commentId",
        as: "likes",
        pipeline: [
          {
            $project: {
              _id: 1,              
              likedBy:1,           
            },
          },
        ],
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        likeBy: { $map: { input: "$likes", as: "like", in: "$$like.likedBy" } }        
      },
    },
    {
      $sort : {createdAt : -1},
    },
    {
      $project: {
        content: 1,
        postId: 1,
        commentBy: 1,
        name: 1,
        likeCount: 1,
        likeBy: 1
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

const commentDelete = async ( commentBy, commentId) => {
  const deleteComment = await postCommentsModel.findOneAndDelete({ _id:commentId,commentBy});
  return deleteComment;
};

export { postCommentAdded,commentDelete,getAllComments };
