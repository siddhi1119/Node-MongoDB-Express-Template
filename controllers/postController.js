import { sendError, sendSuccessResponse } from "../utils/ApiResponse.js";
import { getAllPosts, postCreate } from "../services/postServices.js";
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

const fetchAllPost = async (req, res) => {
  try {
    const { searchString, page, limit } = req.query;
    const allPosts = await getAllPosts({ searchString, category:req.parsedCategory, page, limit }); 
    return sendSuccessResponse(req, res, allPosts, allPosts?.length);
  } catch (error) {     
    console.log(error); 
    return sendError(error, req, res, 400);
  }
};

export default {
  createPost,
  fetchAllPost,
};
