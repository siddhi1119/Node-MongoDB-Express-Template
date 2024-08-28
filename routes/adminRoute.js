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

const router = express.Router();

router
  .route("/blocked-users")
  .get(isActiveAdmin, authController.fetchBlockedUsers);

router
  .route("/unblocked-users/:id")
  .put(
    isActiveAdmin,
    validate(adminSchemas.blockUserSchema),
    authController.UnblockedUsers
  );

router
  .route("/posts")
  .get(isActiveAdmin, parseCategoryMiddleware, postController.fetchAllPost);

router
  .route("/create-post")
  .post(
    isActiveAdmin,
    validate(postSchemas.postValidationSchema),
    postController.createPost
  );

router
  .route("/like")
  .put(isActiveAdmin, postLikeController.likePost);

router
  .route("/unlike")
  .put(isActiveAdmin, postLikeController.unLikePost);

router
  .route("/comment")
  .post(isActiveAdmin, postCommentController.commentPost);

router
  .route("/edit-comment")
  .put(isActiveAdmin, postCommentController.editComment);

router
  .route('/fetch-comments')
  .get(isActiveAdmin, postCommentController.fetchAllcomments);

router
  .route("/delete-comment")
  .delete(isActiveAdmin, postCommentController.deleteComment);

router
  .route("/comment-like")
  .put(isActiveAdmin, commentLikeController.likeComment);

router
  .route("/comment-dislike")
  .put(isActiveAdmin, commentLikeController.unLikeComment);

router
  .route("/reply-to-comment")
  .post(isActiveAdmin, postCommentController.replyToComment);


router.all("/unblocked-users", (req, res) => {
  res.status(400).json({
    status: "error",
    message: "userId is required in the URL",
  });
});
export default router;
