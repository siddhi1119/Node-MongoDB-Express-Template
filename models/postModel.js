import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {type: String, required: true },
  image: { type: String, required: true},
  description: { type: String,required: true},
  category: {type: [String], required: true},  
  likes: {type: Number, default: 0},
  isLiked: {type: Boolean,default: false},
  likedBy: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users'}, 
    name: { type: String } 
  }],
  createdBy: {
     id: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
    },
    role: {type: String, required: true},

  },
}, { timestamps: true });

postSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

postSchema.set('toObject', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    ret.likedBy.forEach(like => delete like._id);
    return ret;
  }
});

postSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    ret.likedBy.forEach(like => delete like._id);
    return ret;
  }
});


const postModel = mongoose.model('Post', postSchema);

export default postModel;