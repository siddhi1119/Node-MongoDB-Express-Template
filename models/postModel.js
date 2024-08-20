import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {type: String, required: true },
  image: { type: String, required: true},
  description: { type: String,required: true},
  category: {type: [String], required: true},  
  likes: {type: Number, default: 0},
  isLiked: {type: Boolean,default: false},
  createdBy: {
     id: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
    },
    role: {type: String, required: true},

  },
}, { timestamps: true });

const postModel = mongoose.model('Post', postSchema);

export default postModel;