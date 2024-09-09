import mongoose from 'mongoose';

const commentLikesSchema = new mongoose.Schema({
  commentId: { type: mongoose.Schema.Types.ObjectId, index: true, ref: 'PostComments', required: true },
  likedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  name: { type: String },
  createdAt: { type: Date, default: Date.now },
});


const commentLikesModel = mongoose.model('CommentLikes', commentLikesSchema);

export default commentLikesModel;