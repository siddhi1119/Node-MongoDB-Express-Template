import { sendSuccessResponse } from '../utils/ApiResponse.js';
import { postLikeAdded } from '../services/postLikeSeravice.js';

const likePost = async(req,res) => {
    const { postId } = req.body;
    const likedBy =  req?.user?._id + "";
    const name = req?.user?.name;

    try{
      const newLike = await postLikeAdded({
        postId,likedBy,name
      });
      return sendSuccessResponse(req, res, newLike, newLike?.length)
    } catch(error){
      return sendError(error, req, res, 400);
    }
}

// const registerAdmin = async (req, res) => {
//   const { email, password, role } = req.body
//   try {
//     const newUser = await createNewAdminUser({
//       email,
//       password,
//       role
//     });
//     const tokens = await generateAuthTokens(newUser)
//     res.json({ user: newUser, tokens });
//   } catch (error) {
//     return sendError(error, req, res, 400);
//   }
// };


// const likePost = async (req, res) => {
//     const {postId} = req.params;
//     const userId = req?.user?._id.toString();
  
//     const likedBy = {
//       id: userId,
//       name: req?.user?.role === 'admin' ? req?.user?.email : req?.user?.firstName,
//     };
  
//     try{
//       const post = await postLikesModel.findById(postId);
//       if (!post) return res.status(404).json({ message: 'Post not found' });
     
//       const userHasLiked = post.likedBy.some(like=>like.userId?.toString()===userId);
      
//       let updateOperations = {};
//       if(userHasLiked){
//         updateOperations = {
//           $inc: { likes: -1 },
//           $set: { isLiked: false },
//           $pull: { likedBy: { userId: userId } }
//         };
//       } else {
//         updateOperations = {
//           $inc: { likes: 1 },
//           $set: { isLiked: true },
//           $push: { likedBy: { userId: likedBy.id , name : likedBy.name }}
//         };   
//       }
//       const updatedPost = await postLikesModel.findByIdAndUpdate(postId,updateOperations,{new:true});
//       return sendSuccessResponse(req, res, updatedPost)
//     } catch (error) {
//       console.log(error);
//       return sendError(error, req, res, 400);
//     }
//   };

  export default {
    likePost
  }