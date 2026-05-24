import { Router } from 'express'
import { validate } from '../middleware/validate.middleware'
import { protect } from '../middleware/auth.middleware'
import { updateProfileSchema } from '../schemas/circle.schema'
import * as UserController from '../controllers/user.controller'

const router = Router()

router.use(protect)

router.get('/me', UserController.getMe)
router.patch('/me', validate(updateProfileSchema), UserController.updateMe)
router.get('/:id', UserController.getUserById)
router.get('/', UserController.getAllUsers)

export default router
