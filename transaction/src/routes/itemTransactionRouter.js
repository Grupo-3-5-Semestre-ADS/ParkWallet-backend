import { Router } from 'express'
import validator from "../middlewares/validator.js";
import schema from "./validators/itemTransactionValidator.js";
import {
  createItemTransaction,
  deleteItemTransaction,
  editItemTransaction,
  listItemsTransaction,
  showItemTransaction
} from "../controllers/itemTransactionController.js";

const router = Router()

router.get('/', listItemsTransaction)
router.get('/:id', showItemTransaction)
router.post('/', validator(schema), createItemTransaction)
router.put('/:id', validator(schema), editItemTransaction)
router.delete('/:id', deleteItemTransaction)

export default router
