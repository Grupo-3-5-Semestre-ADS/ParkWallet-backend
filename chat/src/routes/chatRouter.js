import {Router} from 'express'
import validator from "../middlewares/validator.js";
import schema from "./validators/chatValidator.js";
import {
  createChat,
  deleteChat,
  editChat,
  listChats,
  showChat
} from "../controllers/chatController.js";

const router = Router()

router.get('/', listChats)
router.get('/:id', showChat)
router.post('/', validator(schema), createChat)
router.put('/:id', validator(schema), editChat)
router.delete('/:id', deleteChat)

export default router
