import postCommentsModel from "../models/postComment.js";
import postModel from "../models/postModel.js";
import CommentsReplyModel from "../models/replyComment.js";

const postCommentAdded = async (content, postId, commentBy, name) => {
  const addComment = await postCommentsModel.create({
    content,
    commentBy,
    name,
    postId,
  });
  return addComment;
};

const getAllComments = async ({ postId, page = 1, limit = 10 }) => {
  let matchConditions = {};

  if (postId) {
    matchConditions.postId = postId; 
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
              likedBy: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "commentreplies",
        localField: "_id",
        foreignField: "parentCommentId",
        as: "replies",   
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        likeBy: { $map: { input: "$likes", as: "like", in: "$$like.likedBy" } },
        replyCount :  { $size: "$replies" },
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
        createdAt:1,
        likeCount: 1,
        likeBy: 1,        
        replyCount:1,
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

const editCommentOrReply = async (model,commentBy, commentId, updatedContent) => {

  if (!commentId) throw new Error('commentId is required');

  if (!updatedContent) throw new Error('updatedContent is required');

  const comment = await model.findOne({ _id: commentId }, { commentBy: 1 });

  if (!comment)  throw new Error('Comment not found');
  
  if (comment.commentBy.toString() !== commentBy.toString())    throw new Error('Not authorized to edit this comment');
  
  const editedComment = await model.findByIdAndUpdate(commentId, { content: updatedContent }, { new: true });

  if (!editedComment)   throw new Error('Failed to edit comment');
  
  return editedComment;
};

const commentDelete = async (model,commentBy, commentId) => {

  if (!commentId) {
    throw new Error('commentId is required');
  }
  const comment = await model.findOne({ _id: commentId }, { commentBy: 1 })
  if (!comment) throw new Error('Comment not found');

  if (comment.commentBy.toString() !== commentBy.toString()) throw new Error('Not authorized to delete this comment');

  const deletedComment = await model.findByIdAndDelete(commentId);

  if (!deletedComment) throw new Error('Failed to delete comment');

  return deletedComment;
};

const addReplyToComment = async (parentCommentId, postId, commentBy, content, name) => {
  if (!parentCommentId || !postId || !content)     throw new Error('parentCommentId, postId, and content are required');
  
  const parentComment = await postCommentsModel.findOne({
    $and: [
      { _id: parentCommentId },
      { postId: postId }
    ]
  });

  if (!parentComment) throw new Error('Parent comment not found or does not belong to the specified post');

  const savedReply = await CommentsReplyModel.create({
    content, postId, parentCommentId, commentBy , name
  })

  return savedReply;
};


export { postCommentAdded, commentDelete, getAllComments, editCommentOrReply, addReplyToComment};
