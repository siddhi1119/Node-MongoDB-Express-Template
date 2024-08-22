import express from 'express';
import { isActiveAdmin, isActiveUser } from '../middlewares/isActiveUser.js';
import authController from '../controllers/authController.js';
import adminSchemas from '../validations/adminValidation.js';
import postSchemas from '../validations/postValidation.js';
import validate from '../utils/yupValidations.js';
import postController from '../controllers/postController.js';
import postLikeController from '../controllers/postLikeController.js';



const router = express.Router();

router
  .route('/blocked-users')
  .get(isActiveAdmin,authController.fetchBlockedUsers)

router
  .route('/unblocked-users/:id')
  .put(isActiveAdmin,validate(adminSchemas.blockUserSchema),authController.UnblockedUsers)

router
  .route('/posts')
  .get(isActiveAdmin,postController.fetchAllPost)

router
  .route('/create-post')
  .post(isActiveAdmin,validate(postSchemas.postValidationSchema),postController.createPost)

router
  .route('/like')
  .put(isActiveAdmin,postLikeController.likePost)

router.all('/unblocked-users', (req, res) => {
    res.status(400).json({
      status: 'error',
      message: 'userId is required in the URL',
    });
  });
export default router;
