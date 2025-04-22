import {Router} from 'express'
import validator from "../middlewares/validator.js";
import schema from "./validators/notificationValidator.js";
import {
  createNotification,
  deleteNotification,
  editNotification,
  listNotifications,
  showNotification
} from "../controllers/notificationController.js";

const router = Router()

router.get('/', listNotifications)
router.get('/:id', showNotification)
router.post('/', validator(schema), createNotification)
router.put('/:id', validator(schema), editNotification)
router.delete('/:id', deleteNotification)

export default router
