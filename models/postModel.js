import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {type: String, required: true },
  images: { type: [String], required: true},
  description: { type: String,required: true},
  category: {type: [String], required: true},    
  createdBy: {
     id: {
      type: mongoose.Schema.Types.ObjectId, ref: "users",
      required: true,
    },
    name:{type: String},    
    role: {type: String, required: true},
  },
  createdAt: {type: Date, default: Date.now},
});


const postModel = mongoose.model('Post', postSchema);

export default postModel;