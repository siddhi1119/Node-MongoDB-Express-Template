import { sendError, sendSuccessResponse } from '../utils/ApiResponse.js';
import { getAllPosts,postCreate } from '../services/postServices.js';
import { uploadImage } from '../utils/imageUtils.js';

const createPost = async (req, res) => {    
    try {      
      const { title, images, description, category } = req.body;   
      let imageUrl = await uploadImage(images);
      if(!imageUrl) throw new Error('Something wrong in image upload');
      const newPost = await postCreate(title,imageUrl,description,category,req.user)
      return sendSuccessResponse(req, res, newPost)
    } catch (error) {          
      return sendError(error, req, res, 400);
    }
  };

const fetchAllPost = async (req, res) => {
    try {
      const {searchString, category} = req.query;
      const parsedCategory = JSON.parse(category ?? "[]")
      let query = {};
  
      if(searchString){
        const regex = new RegExp(searchString, 'i');
        query.$or = [{ title: regex }, { description: regex }];
      }
      
      if(parsedCategory?.length){
        query.category = { $in: parsedCategory };
      }      
      const allPosts = await getAllPosts(query);
      return sendSuccessResponse(req, res, allPosts,allPosts?.length) 
    } catch (error) {
      return sendError(error, req, res, 400);
    }
  }

  export default {  
    createPost,
    fetchAllPost
  }