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
import {verify} from "../controllers/authController.js";

const router = Router()

router.get('/', verify(["ADMIN"]), listWallets)
router.get('/:id', showWallet)
router.post('/', verify(["ADMIN"]), validator(schema), createWallet)
router.put('/:id', verify(["ADMIN"]), validator(schema), editWallet)
router.delete('/:id', verify(["ADMIN"]), deleteWallet)
router.patch('/:id/balance', validator(balanceSchema), patchBalance)

export default router
