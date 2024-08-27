import postLikesModel from '../models/postLikes.js';
import httpStatus from 'http-status';
import APIError from '../utils/APIError.js';

const postLikeAdded = async({postId,likedBy,name})=>{  
    const isAlreadyLikedPost = await postLikesModel.findOne({postId,likedBy}).lean();
    if (!isAlreadyLikedPost) {
        const newLike = await postLikesModel.create({
          postId,
          likedBy,
          name
        });
        return newLike;
      }
}

const postLikeRemove = async({postId,likedBy})=>{    
  const disLikePost = await postLikesModel.deleteOne({postId,likedBy}).lean();  
  return disLikePost;
}


export {  
    postLikeAdded,
    postLikeRemove    
  };