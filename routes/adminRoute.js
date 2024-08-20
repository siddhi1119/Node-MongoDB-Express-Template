import express from 'express';
import { isActiveAdmin, isActiveUser } from '../middlewares/isActiveUser.js';
import authController from '../controllers/authController.js';
import adminSchemas from '../validations/adminValidation.js';
import validate from '../utils/yupValidations.js';



const router = express.Router();

router
  .route('/blocked-users')
  .get(isActiveAdmin,authController.fetchBlockedUsers)

router
  .route('/posts')
  .get(authController.fetchAllPost)

router
  .route('/search-post')
  .post(authController.searchPost)

router
  .route('/search-post')
  .get(authController.searchPostsByCategory)

router
  .route('/unblocked-users/:id')
  .put(isActiveAdmin,validate(adminSchemas.blockUserSchema),authController.UnblockedUsers)

router
  .route('/create-post')
  .post(isActiveAdmin,validate(adminSchemas.postValidationSchema),authController.createPost)

router.all('/unblocked-users', (req, res) => {
    res.status(400).json({
      status: 'error',
      message: 'userId is required in the URL',
    });
  });
export default router;
