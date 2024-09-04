import express from "express";
import { isActiveAdmin } from "../middlewares/isActiveUser.js";
import authController from "../controllers/authController.js";
import adminSchemas from "../validations/adminValidation.js";
import postSchemas from "../validations/postValidation.js";
import validate from "../utils/yupValidations.js";
import postController from "../controllers/postController.js";
import postLikeController from "../controllers/postLikeController.js";
import parseCategoryMiddleware from "../middlewares/parseCategoryMiddleware.js";
import postCommentController from "../controllers/postCommentController.js";
import commentLikeController from "../controllers/commentLikeController.js";
import commentReplyLikeController from "../controllers/commentReplyLikeController.js";

const router = express.Router();

router
  .route("/blocked-users")
  .get(isActiveAdmin, authController.fetchBlockedUsers);

router
  .route("/unblocked-user/:id")
  .put(
    isActiveAdmin,
    validate(adminSchemas.blockUserSchema),
    authController.UnblockedUsers
  );

router
  .route("/unapproved-user")
  .get(isActiveAdmin, authController.fetchUnApprovedUser);

router
  .route("/unapproved-user/:id")
  .put(
    isActiveAdmin,
    authController.unApprovedUser
  );

router
  .route("/posts")
  .get(isActiveAdmin, postController.fetchAllPost);

router
  .route("/create-post")
  .post(
    isActiveAdmin,
    validate(postSchemas.postValidationSchema),
    postController.createPost
  );

router
  .route("/like/:id")
  .put(isActiveAdmin, postLikeController.likePost);

router
  .route("/unlike/:id")
  .put(isActiveAdmin, postLikeController.unLikePost);

router
  .route("/comment/:id")
  .post(isActiveAdmin, postCommentController.commentPost);

router
  .route("/edit-comment/:id")
  .put(isActiveAdmin, postCommentController.editComment);

router
  .route('/fetch-comments/:id')
  .get(isActiveAdmin, postCommentController.fetchAllcomments);

router
  .route("/delete-comment/:id")
  .delete(isActiveAdmin, postCommentController.deleteComment);

router
  .route("/comment-like")
  .put(isActiveAdmin, commentLikeController.likeComment);

router
  .route("/comment-dislike")
  .put(isActiveAdmin, commentLikeController.unLikeComment);

router
  .route("/reply-to-comment/:id")
  .post(isActiveAdmin, postCommentController.replyToComment);

router
  .route("/edit-reply-comment/:id")
  .put(isActiveAdmin, postCommentController.editReplyComment);

router
  .route("/delete-reply-comment/:id")
  .delete(isActiveAdmin, postCommentController.deleteReplyComment);

router
  .route("/like-reply-comment")
  .put(isActiveAdmin, commentReplyLikeController.likeReplyComment);

router
  .route("/dislike-reply-comment/:id")
  .put(isActiveAdmin, commentReplyLikeController.unLikeReplyComment);

router
  .route("/reply-comment/:id")
  .get(isActiveAdmin, commentReplyLikeController.fetchReplyComment);
  
router.all("/unblocked-users", (req, res) => {
  res.status(400).json({
    status: "error",
    message: "userId is required in the URL",
  });
});
export default router;
