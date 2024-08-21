import express from 'express';
import { isActiveUser } from '../middlewares/isActiveUser.js';
import userController from '../controllers/userController.js';
import trimRequest from 'trim-request';
import validate from '../utils/yupValidations.js';
import adminSchemas from '../validations/adminValidation.js';
import authController from '../controllers/authController.js';


const router = express.Router();

router
  .route('/')
  .get(trimRequest.all, isActiveUser, userController.getUserInfo);

router
  .route('/create-post')
  .post(isActiveUser, validate(adminSchemas.postValidationSchema), authController.createPost)

router
  .route('/posts')
  .get(authController.fetchAllPost)

// router
//   .route('/search-post')
//   .get(authController.searchPost)

// router
//   .route('/search-posts-by-category')
//   .get(authController.searchPostsByCategory)

  router
  .route('/like/:postId')
  .put(isActiveUser,authController.likePost)

export default router;
