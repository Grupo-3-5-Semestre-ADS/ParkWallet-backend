import { Router } from 'express';
import validator from '../middlewares/validator.js';
import schema from './validators/userValidator.js';
import {
  createUser,
  deleteUser,
  editUser,
  listUsers,
  showUser,
  addRoleToUser,
  removeRoleFromUser,
  listUserRoles
} from '../controllers/userController.js';

const router = Router();

router.get('/', listUsers);
router.get('/:id', showUser);
router.post('/', validator(schema), createUser);
router.put('/:id', validator(schema), editUser);
router.delete('/:id', deleteUser);

router.get('/:id/roles', listUserRoles);
router.post('/:id/roles', addRoleToUser);
router.delete('/:id/roles', removeRoleFromUser);

export default router;
