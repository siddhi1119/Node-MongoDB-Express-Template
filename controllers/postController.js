import { sendError, sendSuccessResponse } from "../utils/ApiResponse.js";
import { getAllPosts, postCreate, postDelete, postEdit } from "../services/postServices.js";
import { uploadImage } from "../utils/imageUtils.js";

const createPost = async (req, res) => {
  try {
    const { title, images, description, category } = req.body;
    if (!images || !Array.isArray(images)) {
      throw new Error("Images must be an array and cannot be empty");
    }
    let imageUrl = await uploadImage(images);
    if (!imageUrl) throw new Error("Something wrong in image upload");
    const newPost = await postCreate(
      title,
      imageUrl,
      description,
      category,
      req.user
    );
    return sendSuccessResponse(req, res, newPost);
  } catch (error) {
    console.log(error);
    return sendError(error, req, res, 400);
  }
};

const editPost = async (req, res) => {
  const { id:postId } = req.params;
  const { title, images, description, category } = req.body; 
  let imageUrl = await uploadImage(images);
  try {
    
    const updatedFields = {
      ...(title && { title }),
      ...(imageUrl && { images: imageUrl }),  
      ...(description && { description }),
      ...(category && { category }),
    };

    const editedPost = await postEdit(postId,updatedFields,req.user );
    return sendSuccessResponse(req, res, editedPost);
  } catch (error) {
    return sendError(error, req, res, 400);
  }
}

const fetchAllPost = async (req, res) => {
  try {
    const { searchString, page, limit } = req.query;
    const parsedCategory = req.query.category || [];
    const allPosts = await getAllPosts({ searchString, parsedCategory, page, limit}); 
    return sendSuccessResponse(req, res, allPosts, allPosts?.length);
  } catch (error) {     
    console.log(error); 
    return sendError(error, req, res, 400);
  }
};

const deletePost = async (req, res) => { 
  const { id: postId } = req.params;
  const createdBy = req?.user?._id + "";
  try {
    const remoevePosts = await postDelete({postId,createdBy});
    return sendSuccessResponse(req, res, remoevePosts);
  } catch (error) {
    console.log(error);
    return sendError(error.message, req, res, 400);
  }
};


export default {
  createPost,
  editPost,
  fetchAllPost,
  deletePost
};
