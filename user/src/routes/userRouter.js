import { Router } from 'express';
import validator from '../middlewares/validator.js';
import {
  deleteUser,
  editUser,
  listUsers,
  showUser,
} from '../controllers/userController.js';

import { updateUserSchema } from './validators/userValidator.js';

const router = Router();

router.get('/', listUsers);
router.get('/:id', showUser);
router.put('/:id', validator(updateUserSchema), editUser);
router.delete('/:id', deleteUser);

export default router;
