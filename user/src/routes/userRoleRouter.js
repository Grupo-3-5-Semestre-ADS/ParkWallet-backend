import { Router } from 'express';
import {
  assignRolesToUser,
  removeRolesFromUser
} from '../controllers/roleController.js';

const router = Router();

router.patch('/:id/add-roles', assignRolesToUser);
router.patch('/:id/remove-roles', removeRolesFromUser);

export default router;
