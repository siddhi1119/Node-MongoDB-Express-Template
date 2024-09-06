import mongoose from 'mongoose';

const replyCommentSchema = new mongoose.Schema({ 
  content: { type: String, required: true },
  postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required:true},
  parentCommentId: {type: mongoose.Schema.Types.ObjectId, ref: 'PostComments'},
  // parentReplyId: { type: mongoose.Schema.Types.ObjectId, ref: 'commentReply' },
  commentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true},
  name: {type: String},
  createdAt: {type: Date, default: Date.now},
});


const CommentsReplyModel = mongoose.model('commentReply', replyCommentSchema);

export default CommentsReplyModel;