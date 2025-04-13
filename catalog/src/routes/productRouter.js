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
router.get('/:id', showProduct)
router.post('/', validator(schema), createProduct)
router.put('/:id', validator(schema), editProduct)
router.delete('/:id', deleteProduct)

export default router
