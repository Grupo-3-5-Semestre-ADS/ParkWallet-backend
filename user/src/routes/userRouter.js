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

const router = Router();

router.get('/', listUsers);
router.get('/:id', showUser);
router.put('/:id', validator(updateUserSchema), editUser);
router.patch('/:id/toggle-status', toggleUserStatus);
router.patch('/:id/role', /*verify('ADMIN'),*/ changeUserRole);
router.post('/:id/reset-password', /*verify('ADMIN'),*/ resetPassword);
router.post('/:id/change-password', /*verify('ADMIN'),*/ changePassword);

export default router;
