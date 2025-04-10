import { Router } from  "express";
import validator from "../middlewares/validator.js";
import schema from "./validators/authValidator.js";
import {login} from "../controllers/userController.js";
import {generate} from "../controllers/authController.js";

const router = Router();

router.post('/', validator(schema));
router.post('/', login, generate);

export default router;
