import { Router } from 'express';
import validator from '../middlewares/validator.js';
import schema from './validators/roleValidator.js';
import {
  createRole,
  deleteRole,
  editRole,
  listRoles,
  showRole
} from '../controllers/roleController.js';

const router = Router();

router.get('/', listRoles);
router.get('/:id', showRole);
router.post('/', validator(schema), createRole);
router.put('/:id', validator(schema), editRole);
router.delete('/:id', deleteRole);

export default router;
