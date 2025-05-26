import { Router } from 'express'
import validator from "../middlewares/validator.js";
import rechargeValidator from "./validators/rechargeValidator.js";
import { processRecharge } from "../controllers/rechargeController.js";

const router = Router()

// Rota para processar uma recarga
router.post('/:userId', validator(rechargeValidator), processRecharge)

export default router
