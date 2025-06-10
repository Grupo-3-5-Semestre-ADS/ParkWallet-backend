import { Router } from 'express'
import validator from "../middlewares/validator.js";
import schema from "./validators/productValidator.js";
import {
  createProduct,
  toggleProductStatus,
  editProduct,
  listProducts,
  showProduct,
} from "../controllers/productController.js";
import {verify} from "../controllers/authController.js";

const router = Router()

router.get('/', verify(["ADMIN", "SELLER", "CUSTOMER"]), listProducts)
router.get('/:id', verify(["ADMIN", "SELLER", "CUSTOMER"]), showProduct)
router.post('/', verify(["ADMIN"]), validator(schema), createProduct)
router.put('/:id', verify(["ADMIN"]), validator(schema), editProduct)
router.patch('/:id/toggle-status', verify(["ADMIN"]), toggleProductStatus)

export default router
