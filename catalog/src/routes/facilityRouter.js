import { Router } from 'express'
import validator from "../middlewares/validator.js";
import schema from "./validators/facilityValidator.js";
import {
  createFacility,
  deleteFacility,
  editFacility,
  listFacilities,
  showFacility
} from "../controllers/facilityController.js";

const router = Router()

router.get('/', listFacilities)
router.get('/:id', showFacility)
router.post('/', validator(schema), createFacility)
router.put('/:id', validator(schema), editFacility)
router.delete('/:id', deleteFacility)

export default router
