import mongoose from 'mongoose';

const commentReplyLikesSchema = new mongoose.Schema({ 
  commentId: {type: mongoose.Schema.Types.ObjectId, ref: 'commentReply', required:true},
  likedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true},
  name: {type: String},
  createdAt: {type: Date, default: Date.now},
});


const commentReplyLikesModel = mongoose.model('CommentReplyLikes', commentReplyLikesSchema);

export default commentReplyLikesModel;