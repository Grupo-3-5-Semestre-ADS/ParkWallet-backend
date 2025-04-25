import { Router } from 'express';
import { generateToken } from '../middlewares/jwt.js';
import { User } from '../models/index.js';
import validator from '../middlewares/validator.js';
import schema from './validators/userValidator.js';
const router = Router();
import {
    createUser
  } from '../controllers/userController.js';

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

router.post('/register', validator(schema), createUser);

export default router;