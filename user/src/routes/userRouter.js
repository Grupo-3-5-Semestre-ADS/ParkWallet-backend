import { Router } from 'express';
import validator from '../middlewares/validator.js';
import {
  editUser,
  listUsers,
  showUser,
  toggleUserStatus,
} from '../controllers/userController.js';

import { updateUserSchema } from './validators/userValidator.js';

const router = Router();

router.get('/', listUsers);
router.get('/:id', showUser);
router.put('/:id', validator(updateUserSchema), editUser);
router.patch('/:id/toggle-status', toggleUserStatus);

export default router;
