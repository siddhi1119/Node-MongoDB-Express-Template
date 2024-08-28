import express from 'express';
import { isActiveUser } from '../middlewares/isActiveUser.js';
import userController from '../controllers/userController.js';
import trimRequest from 'trim-request';
import validate from '../utils/yupValidations.js';
import postSchemas from '../validations/postValidation.js';
import postController from '../controllers/postController.js';
import postLikeController from '../controllers/postLikeController.js';
import postCommentController from '../controllers/postCommentController.js';
import commentLikeController from '../controllers/commentLikeController.js';


const router = express.Router();

router
  .route('/')
  .get(trimRequest.all, isActiveUser, userController.getUserInfo);

router
  .route('/create-post')
  .post(isActiveUser, validate(postSchemas.postValidationSchema), postController.createPost)

router
  .route('/posts')
  .get(isActiveUser, postController.fetchAllPost)

router
  .route('/like')
  .put(isActiveUser, postLikeController.likePost)

router.route("/unlike")
  .put(isActiveUser, postLikeController.unLikePost);

router
  .route("/comment")
  .post(isActiveUser, postCommentController.commentPost);

router
  .route("/edit-comment")
  .put(isActiveUser, postCommentController.editComment);

router
  .route('/fetch-comments')
  .get(isActiveUser, postCommentController.fetchAllcomments);

router
  .route("/delete-comment")
  .delete(isActiveUser, postCommentController.deleteComment);

router
  .route("/comment-like")
  .put(isActiveUser, commentLikeController.likeComment);

router
  .route("/comment-dislike")
  .put(isActiveUser, commentLikeController.unLikeComment);

router
  .route("/reply-to-comment")
  .post(isActiveUser, postCommentController.replyToComment);


export default router;
