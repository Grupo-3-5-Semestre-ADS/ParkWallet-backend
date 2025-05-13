import { Router } from 'express'
import validator from "../middlewares/validator.js";
import schema from "./validators/productListValidator.js";
import {
  makePayment
} from "../controllers/paymentController.js";

const router = Router()

router.post('/:userId', validator(schema), makePayment)

export default router
