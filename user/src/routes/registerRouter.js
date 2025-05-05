import { Router } from 'express';
import validator from '../middlewares/validator.js';
import {
  createUser
} from '../controllers/registerController.js';

import { createUserSchema } from './validators/userValidator.js';

const router = Router();

router.post("/", validator(createUserSchema), createUser);

export default router;
