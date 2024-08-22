import postLikesModel from '../models/postLikes.js';
import postModel from '../models/postModel.js';

const postLikeAdded = async(postId,likedBy,name)=>{  
    const isAlreadyLikedPost = await postLikesModel.findOne({postId,likedBy}).lean();
    if (isAlreadyLikedPost) {
        throw new APIError(httpStatus.BAD_REQUEST, "post already liked");
      } else {
        const newLike = await postLikesModel.create({
          postId,
          likedBy,
          name
        });
        return newLike;
      }
}



export {  
    postLikeAdded    
  };