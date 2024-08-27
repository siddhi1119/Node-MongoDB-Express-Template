import mongoose from 'mongoose';

const commentLikesSchema = new mongoose.Schema({ 
  commentId: {type: mongoose.Schema.Types.ObjectId, ref: 'PostComments', required:true},
  likedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true},
  name: {type: String}
}, { timestamps: true });


const commentLikesModel = mongoose.model('CommentLikes', commentLikesSchema);

export default commentLikesModel;