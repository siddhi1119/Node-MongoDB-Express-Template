import mongoose from 'mongoose';

const postLikesSchema = new mongoose.Schema({ 
  postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required:true},
  likedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true},
  name: {type: String},
  createdAt: {type: Date, default: Date.now},
});


const postLikesModel = mongoose.model('PostLikes', postLikesSchema);

export default postLikesModel;