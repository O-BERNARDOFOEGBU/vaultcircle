import { Router } from 'express'
import { validate } from '../middleware/validate.middleware'
import { protect } from '../middleware/auth.middleware'
import { createCircleSchema } from '../schemas/circle.schema'
import * as CircleController from '../controllers/circle.controller'

const router = Router()

router.use(protect)

router.post('/', validate(createCircleSchema), CircleController.createCircle)
router.get('/', CircleController.getAllCircles)
router.get('/:id', CircleController.getCircleById)
router.post('/:id/join', CircleController.joinCircle)
router.delete('/:id/leave', CircleController.leaveCircle)

export default router
