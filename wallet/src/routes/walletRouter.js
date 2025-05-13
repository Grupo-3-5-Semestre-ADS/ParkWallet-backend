import {Router} from 'express'
import validator from "../middlewares/validator.js";
import schema from "./validators/walletValidator.js";
import balanceSchema from "./validators/balanceValidator.js";
import {
  createWallet,
  deleteWallet,
  editWallet,
  listWallets,
  showWallet,
  patchBalance,
} from "../controllers/walletController.js";

const router = Router()

router.get('/', listWallets)
router.get('/:id', showWallet)
router.post('/', validator(schema), createWallet)
router.put('/:id', validator(schema), editWallet)
router.delete('/:id', deleteWallet)
router.patch('/:id/balance', validator(balanceSchema), patchBalance)

export default router
