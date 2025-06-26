import { Router } from 'express'
import RechargeController from '../controllers/RechargeController.js';
import validator from '../../../middlewares/validator.js';
import rechargeValidator from '../validators/rechargeValidator.js';
import {verify} from "../../../controllers/authController.js";

const router = Router()

// Rota para processar uma recarga
router.post('/:userId', validator(rechargeValidator), verify(), RechargeController.processRecharge);

export default router;
