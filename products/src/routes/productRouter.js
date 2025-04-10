import { Router } from 'express'
import validator from "../middlewares/validator.js";
import schema from "./validators/productValidator.js";
import {
  createProduct,
  deleteProduct,
  editProduct,
  listProducts,
  showProduct
} from "../controllers/productController.js";

const router = Router()

router.get('/', listProducts)
router.get('/:_id', showProduct)
router.post('/', validator(schema), createProduct)
router.put('/:_id', validator(schema), editProduct)
router.delete('/:_id', deleteProduct)

export default router
