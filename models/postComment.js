import mongoose from 'mongoose';

const postCommentsSchema = new mongoose.Schema({ 
  content: { type: String, required: true },
  postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required:true},
  commentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true},
  name: {type: String},
  createdAt: {type: Date, default: Date.now},
});


const postCommentsModel = mongoose.model('PostComments', postCommentsSchema);

export default postCommentsModel;