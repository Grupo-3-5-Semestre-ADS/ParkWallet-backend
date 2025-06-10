import {Router} from 'express'
import validator from "../middlewares/validator.js";
import schema from "./validators/chatValidator.js";
import {
  createChat, listClientConversations, listUserChats,
} from "../controllers/chatController.js";
import {verify} from "../controllers/authController.js";

const router = Router()

router.post('/', validator(schema), createChat)
router.get('/conversations', verify(["ADMIN", "SELLER"]), listClientConversations)
router.get('/:userId', verify(["ADMIN", "SELLER", "CUSTOMER"]), listUserChats)

export default router
