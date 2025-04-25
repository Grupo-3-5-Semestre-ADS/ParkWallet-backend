import {Router} from 'express'
import validator from "../middlewares/validator.js";
import schema from "./validators/transactionValidator.js";
import {
  createTransaction,
  deleteTransaction,
  editTransaction,
  listItemsByTransaction,
  listTransactions,
  showTransaction
} from "../controllers/transactionController.js";

const router = Router()

router.get('/', listTransactions)
router.get('/:id/items', listItemsByTransaction)
router.get('/:id', showTransaction)
router.post('/', validator(schema), createTransaction)
router.put('/:id', validator(schema), editTransaction)
router.delete('/:id', deleteTransaction)

export default router
