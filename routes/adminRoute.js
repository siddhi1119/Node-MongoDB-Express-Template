import express from 'express';
import { isActiveAdmin, isActiveUser } from '../middlewares/isActiveUser.js';
import controller from '../controllers/authController.js';
import schemas from '../validations/adminValidation.js';
import validate from '../utils/yupValidations.js';





const router = express.Router();

router
  .route('/blocked-users')
  .get(isActiveAdmin,controller.fetchBlockedUsers)

router
  .route('/unblocked-users/:id')
  .put(isActiveAdmin,validate(schemas.blockUserSchema),controller.UnblockedUsers)

router
  .route('/createpost')
  .post(isActiveAdmin,validate(schemas.postValidationSchema),controller.createPost)

router.all('/unblocked-users', (req, res) => {
    res.status(400).json({
      status: 'error',
      message: 'userId is required in the URL',
    });
  });
export default router;
