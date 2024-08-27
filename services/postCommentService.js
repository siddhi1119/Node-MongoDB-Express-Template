import postCommentsModel from "../models/postComment.js";
import postModel from "../models/postModel.js";

const postCommentAdded = async (content, postId, commentBy, name) => {
  const addComment = await postCommentsModel.create({
    content,
    commentBy,
    name,
    postId,
  });

//  await postModel.findByIdAndUpdate(postId, {
//     $push: { comments: postCommentsModel._id },
//   });
  return addComment;
};

export { postCommentAdded };
