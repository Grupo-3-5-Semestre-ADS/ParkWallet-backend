import {Router} from 'express'
import validator from "../middlewares/validator.js";
import schema from "./validators/facilityValidator.js";
import {
  createFacility,
  toggleFacilityStatus,
  editFacility,
  listFacilities,
  listProductsByFacility,
  showFacility,
  listTransactionsByFacility
} from "../controllers/facilityController.js";
import {verify} from "../controllers/authController.js";

const router = Router()

router.get('/', verify(["ADMIN", "SELLER", "CUSTOMER"]), listFacilities)
router.get('/:id/products', verify(["ADMIN", "SELLER", "CUSTOMER"]), listProductsByFacility)
router.get('/:id/transactions', verify(["ADMIN", "SELLER"]), listTransactionsByFacility)
router.get('/:id', verify(["ADMIN", "SELLER", "CUSTOMER"]), showFacility)
router.post('/', verify(["ADMIN"]), validator(schema), createFacility)
router.put('/:id', verify(["ADMIN"]), validator(schema), editFacility)
router.patch('/:id/toggle-status', verify(["ADMIN"]), toggleFacilityStatus)

export default router
