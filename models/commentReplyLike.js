import mongoose from 'mongoose';

const commentReplyLikesSchema = new mongoose.Schema({ 
  commentId: {type: mongoose.Schema.Types.ObjectId, ref: 'commentReply', required:true},
  likedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true},
  name: {type: String}
}, { timestamps: true });


const commentReplyLikesModel = mongoose.model('CommentReplyLikes', commentReplyLikesSchema);

export default commentReplyLikesModel;