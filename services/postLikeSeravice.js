import postLikesModel from '../models/postLikes.js';

const postLikeAdded = async ({ postId, likedBy, name }) => {
  
  const isAlreadyLikedPost = await postLikesModel.findOne({ postId, likedBy }).lean();
  if (!isAlreadyLikedPost) {
    const newLike = await postLikesModel.create({
      postId,
      likedBy,
      name
    });
    return newLike;
  } else {   
     throw new Error('status code : 200');
  }
}

const postLikeRemove = async ({ postId, likedBy }) => {
  const disLikePost = await postLikesModel.deleteOne({ postId, likedBy }).lean();
  return disLikePost;
}


export {
  postLikeAdded,
  postLikeRemove
};