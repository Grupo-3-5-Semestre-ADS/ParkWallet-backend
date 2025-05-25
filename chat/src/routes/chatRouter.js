import {Router} from 'express'
import validator from "../middlewares/validator.js";
import schema from "./validators/chatValidator.js";
import {
  createChat, listClientConversations, listUserChats,
} from "../controllers/chatController.js";

const router = Router()

router.post('/', validator(schema), createChat)
router.get('/conversations', listClientConversations)
router.get('/:userId', listUserChats)

export default router
