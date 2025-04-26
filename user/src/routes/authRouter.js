import { Router } from 'express';
import { generateToken } from '../middlewares/jwt.js';
import { User } from '../models/index.js';
import validator from '../middlewares/validator.js';
import schema from './validators/userValidator.js';
import bcrypt from 'bcryptjs';
const router = Router();
import {
    createUser
  } from '../controllers/userController.js';

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.scope('withPassword').findOne({ where: { email } });
  
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.unauthorized();
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

router.post('/register', validator(schema), createUser);

export default router;