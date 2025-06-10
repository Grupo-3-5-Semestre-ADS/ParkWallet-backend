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
import {verify} from "../controllers/authController.js";

const router = Router()

router.get('/', verify(["ADMIN"]), listNotifications)
router.get('/:id', verify(["ADMIN"]), showNotification)
router.post('/', verify(["ADMIN"]), validator(schema), createNotification)
router.put('/:id', verify(["ADMIN"]), validator(schema), editNotification)
router.delete('/:id', verify(["ADMIN"]), deleteNotification)

export default router
