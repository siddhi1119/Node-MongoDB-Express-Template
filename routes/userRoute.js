import express from 'express';
import { isActiveUser } from '../middlewares/isActiveUser.js';
import userController from '../controllers/userController.js';
import trimRequest from 'trim-request';
import validate from '../utils/yupValidations.js';
import adminSchemas from '../validations/adminValidation.js';
import postSchemas from '../validations/postValidation.js';
import authController from '../controllers/authController.js';
import postController from '../controllers/postController.js';
import postLikeController from '../controllers/postLikeController.js';
import postCommentController from '../controllers/postCommentController.js';


const router = express.Router();

router
  .route('/')
  .get(trimRequest.all, isActiveUser, userController.getUserInfo);

router
  .route('/create-post')
  .post(isActiveUser, validate(postSchemas.postValidationSchema), postController.createPost)

router
  .route('/posts')
  .get(isActiveUser,postController.fetchAllPost)

router
  .route('/like')
  .put(isActiveUser,postLikeController.likePost)

router
  .route("/comment") 
  .post(isActiveUser, postCommentController.commentPost);

export default router;
