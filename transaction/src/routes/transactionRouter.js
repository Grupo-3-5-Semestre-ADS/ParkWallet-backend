import {Router} from 'express'
import validator from "../middlewares/validator.js";
import schema from "./validators/transactionValidator.js";
import {
  createTransaction,
  toggleTransactionStatus,
  editTransaction,
  listItemsByTransaction,
  listTransactions,
  showTransaction,
  listUserTransactionsWithItems,
  listTransactionsByProductIds
} from "../controllers/transactionController.js";

const router = Router()

router.get('/', listTransactions)
router.get('/by-user', listUserTransactionsWithItems)
router.get('/by-products', listTransactionsByProductIds)
router.get('/:id/items', listItemsByTransaction)
router.get('/:id', showTransaction)
router.post('/', validator(schema), createTransaction)
router.put('/:id', validator(schema), editTransaction)
router.patch('/:id/toggle-status', toggleTransactionStatus)

export default router
