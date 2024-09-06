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
import commentReplyLikeController from '../controllers/commentReplyLikeController.js';


const router = express.Router();

router
  .route('/')
  .get(trimRequest.all, isActiveUser, userController.getUserInfo);

router
  .route('/create-post')
  .post(isActiveUser, validate(postSchemas.postValidationSchema), postController.createPost)

router
  .route("/posts")
  .get(isActiveUser, postController.fetchAllPost);

router
  .route("/edit-post/:id")
  .put(isActiveUser, postController.editPost);

router
  .route("/delete-post/:id")
  .delete(isActiveUser, postController.deletePost);

router
  .route("/like/:id")
  .put(isActiveUser, postLikeController.likePost);

router
  .route("/unlike/:id")
  .put(isActiveUser, postLikeController.unLikePost);

router
  .route("/comment/:id")
  .post(isActiveUser, postCommentController.commentPost);

router
  .route("/edit-comment/:id")
  .put(isActiveUser, postCommentController.editComment);

router
  .route('/fetch-comments/:id')
  .get(isActiveUser, postCommentController.fetchAllcomments);

  router
  .route("/delete-comment/:id")
  .delete(isActiveUser, postCommentController.deleteComment);

  router
  .route("/comment-like/:id")
  .put(isActiveUser, commentLikeController.likeComment);

router
  .route("/comment-dislike/:id")
  .put(isActiveUser, commentLikeController.unLikeComment);

router
  .route("/reply-to-comment/:id")
  .post(isActiveUser, postCommentController.replyToComment);

router
  .route("/edit-reply-comment/:id")
  .put(isActiveUser, postCommentController.editReplyComment);

router
  .route("/delete-reply-comment/:id")
  .delete(isActiveUser, postCommentController.deleteReplyComment);

  router
  .route("/like-reply-comment/:id")
  .put(isActiveUser, commentReplyLikeController.likeReplyComment);

router
  .route("/dislike-reply-comment/:id")
  .put(isActiveUser, commentReplyLikeController.unLikeReplyComment);

router
  .route("/reply-comment/:id")
  .get(isActiveUser, commentReplyLikeController.fetchReplyComment)



export default router;
