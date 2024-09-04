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

// const getAllPosts = async ({
//   searchString,
//   parsedCategory,
//   page = 1,
//   limit = 10,
// }) => {
//   // const parsedCategory = JSON.parse(category ?? "[]");
//   let matchConditions = {};

//   if (searchString) {
//     const regex = new RegExp(searchString, "i");
//     matchConditions.$or = [{ title: regex }, { description: regex }];
//   }

//   if (parsedCategory?.length > 0) {
//     matchConditions.category = { $in: parsedCategory };
//   }

//   const skip = (parseInt(page) - 1) * parseInt(limit);

//   const posts = await postModel.aggregate([
//     {
//       $match: {
//         ...matchConditions,
//         _id: new ObjectId("66c72c72b9dd40eeffd401cb"),
//         // _id: new ObjectId("66c6e117ab51a2bd8f1ce42f"),
//       },
//     },
//     {
//       $lookup: {
//         from: "postlikes",
//         localField: "_id",
//         foreignField: "postId",
//         as: "likes",
//         pipeline: [
//           {
//             $project: {
//               _id: 1,
//               likedBy: 1,
//             },
//           },
//         ],
//       },
//     }, {
//       $lookup: {
//         from: "postcomments",
//         localField: "_id",
//         foreignField: "postId",
//         as: "comments",
//         pipeline: [
//           {
//             $lookup: {
//               from: "commentreplies",
//               localField: "_id",
//               foreignField: "postId",
//               as: "replies",
//             },
//           },
//           {
//             $addFields: {
//               replyCount: { $size: { $ifNull: ["$replies", []] } },
//             },
//           },
//           {
//             $group: {
//               _id: "$_id",
//               commentCount: { $sum: 1 },
//               replyCount: { $sum: "$replyCount" },
//             },
//           },
//         ],
//       },
//     },

//     {
//       $addFields: {
//         likeCount: { $size: "$likes" },
//         likeBy: { $map: { input: "$likes", as: "like", in: "$$like.likedBy" } },
//         // commentCount: { $size: { $ifNull: ["$comments", []] } },
//         commentCount: { $sum: "$comments.commentCount" },
//         replycommentCount: { $sum: "$comments.totalReplyCount" },
//         // replycommentCount: { $sum: "$comments.replyCount" },
//         // totalCommentCount: {
//         //   $add: [
//         //     { $size: { $ifNull: ["$comments", []] } }, 
//         //     { $sum: "$comments.replyCount" } 
//         //   ]
//         // }
//         totalCommentCount: {
//           $add: [
//             { $sum: "$comments.commentCount" },  // Sum of comments
//             { $sum: "$comments.totalReplyCount" } // Sum of replies
//           ],
//         },
//       },
//     },
//     {
//       $sort: { createdAt: -1 },
//     },
//     {
//       $project: {
//         title: 1,
//         images: 1,
//         description: 1,
//         category: 1,
//         createdBy: 1,
//         likeCount: 1,
//         likeBy: 1,
//         commentCount: 1,
//         replycommentCount: 1,
//         totalCommentCount: 1,
//       },
//     },
//     {
//       $skip: skip,
//     },
//     {
//       $limit: parseInt(limit),
//     },
//   ]);

//   return posts;
// };

const getAllPosts = async ({
  searchString,
  parsedCategory=[],
  page = 1,
  limit = 10,
  
}) => {

  
  // const parsedCategory = JSON.parse(category ?? "[]");
  let matchConditions = {};

  if (searchString) {
    const regex = new RegExp(searchString, "i");
    matchConditions.$or = [{ title: regex }, { description: regex }];
  }

  // if (Array.isArray(parsedCategory) && parsedCategory.length > 0) {
  //   matchConditions.category = { $in: parsedCategory };
  // } else {
  //   matchConditions.category = { $exists: true }; // or use any default filter if needed
  // }

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
        createdAt:1,
        likeCount: 1,
        likeBy: 1,        
        // commentCount: 1,
        // replycommentCount: 1,
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

export { postCreate, getAllPosts };
