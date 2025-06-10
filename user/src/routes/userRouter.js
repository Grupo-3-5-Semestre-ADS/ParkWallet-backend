import {Router} from 'express';
import validator from '../middlewares/validator.js';
import {
  editUser,
  listUsers,
  showUser,
  toggleUserStatus,
  changeUserRole,
  resetPassword,
  changePassword
} from '../controllers/userController.js';

import {updateUserSchema} from './validators/userValidator.js';
import {verify} from "../controllers/authController.js";

const router = Router();

router.get('/', verify(["ADMIN"]), listUsers);
router.get('/:id', showUser);
router.put('/:id', verify(["ADMIN"]), validator(updateUserSchema), editUser);
router.patch('/:id/toggle-status', verify(["ADMIN"]), toggleUserStatus);
router.patch('/:id/role', verify(["ADMIN"]), changeUserRole);
router.post('/:id/reset-password', verify(["ADMIN"]), resetPassword);
router.post('/:id/change-password', verify(["ADMIN", "CUSTOMER"]), changePassword);

export default router;
