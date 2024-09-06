import postModel from "../models/postModel.js";
// import { ObjectId } from "mongodb";


const postCreate = async (title, imageUrl, description, category, user) => {
  const createdBy = {
    id: user?._id,
    name: user?.name,
    role: user?.role,
  };
  const newPost = await postModel.create({
    title,
    images: imageUrl,
    description,
    category,
    createdBy: createdBy
  });
  return newPost;
};

const postEdit = async (postId, updatedFields, user) => {
  const createdBy = {
    id: user?._id,
    name: user?.name,
    role: user?.role,
  };
  updatedFields.createdBy = createdBy;
  const updatedPost = await postModel.findByIdAndUpdate(
    postId,
    { $set: updatedFields },
    { new: true }
  );
  return updatedPost;
};

const postDelete = async ({ postId, createdBy }) => {
  if (!postId) {
    throw new Error('postID is required');
  }
  const post = await postModel.findOne({ _id: postId }, { createdBy: 1 })
  console.log("post", post);
  if (!post) throw new Error('post not found');

  if (post?.createdBy?.id.toString() !== createdBy.toString()) throw new Error('Not authorized to delete this post');

  const deletedPost = await postModel.findByIdAndDelete(postId);

  if (!deletedPost) throw new Error('Failed to delete post');

  return deletedPost;

}

const getAllPosts = async ({
  searchString,
  parsedCategory = [],
  page = 1,
  limit = 10,

}) => {

  let matchConditions = {};

  if (searchString) {
    const regex = new RegExp(searchString, "i");
    matchConditions.$or = [{ title: regex }, { description: regex }];
  }

  if (parsedCategory?.length > 0) {
    matchConditions.category = { $in: parsedCategory };
  }

  const totalPosts = await postModel.aggregate([
    { $match: matchConditions },
    { $count: "total" },
  ]);

  const totalCount = totalPosts.length > 0 ? totalPosts[0].total : 0;
  const totalPages = Math.ceil(totalCount / limit);

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const posts = await postModel.aggregate([
    {
      $match: matchConditions,
    },
    {
      $lookup: {
        from: "postlikes",
        localField: "_id",
        foreignField: "postId",
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
    }, {
      $lookup: {
        from: "postcomments",
        localField: "_id",
        foreignField: "postId",
        as: "comments",
        pipeline: [
          {
            $project: {
              _id: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "commentreplies",
        localField: "_id",
        foreignField: "postId",
        as: "replies",
        pipeline: [
          {
            $project: {
              _id: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        likeBy: { $map: { input: "$likes", as: "like", in: "$$like.likedBy" } },
        commentCount: { $size: { $ifNull: ["$comments", []] } },
        replycommentCount: { $size: { $ifNull: ["$replies", []] } },
        totalCommentCount: {
          $add: [
            { $size: { $ifNull: ["$comments", []] } },
            { $size: { $ifNull: ["$replies", []] } },
          ],
        },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $project: {
        title: 1,
        images: 1,
        description: 1,
        category: 1,
        createdBy: 1,
        createdAt: 1,
        likeCount: 1,
        likeBy: 1,
        totalCommentCount: 1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  return {
    posts,
    totalPages,
    totalCount,
  };
};

export { postCreate, postEdit, getAllPosts, postDelete };
