import postModel from "../models/postModel.js";

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
    createdBy: createdBy,
  });
  return newPost;
};

const getAllPosts = async ({
  searchString,
  parsedCategory,
  page = 1,
  limit = 10,
}) => {
  // const parsedCategory = JSON.parse(category ?? "[]");
  let matchConditions = {};

  if (searchString) {
    const regex = new RegExp(searchString, "i");
    matchConditions.$or = [{ title: regex }, { description: regex }];
  }

  if (parsedCategory?.length > 0) {
    matchConditions.category = { $in: parsedCategory };
  }

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
              likedBy:1,           
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
      $sort : {createdAt : -1},
    },
    {
      $project: {
        title: 1,
        images: 1,
        description: 1,
        category: 1,
        createdBy: 1,
        likeCount: 1,
        likeBy: 1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  return posts;
};

export { postCreate, getAllPosts };
