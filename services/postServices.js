import postModel from '../models/postModel.js';

const postCreate = async(title,imageUrl,description,category,user)=>{  
  const createdBy = {
    id: user?._id,
    name: user?.name,
    role: user?.role,
  };
  const newPost = await postModel.create({
    title,
    images: imageUrl,
    description,
    category,
    createdBy : createdBy,
  });
  return newPost;
}

const getAllPosts = async (query) => {
    try {
      const posts = await postModel.find(query).lean();
      return posts;
    } catch (error) {
      throw new Error("Error fetching blocked users: " + error.message);
    }
  }

export {  
    postCreate,
    getAllPosts
  };