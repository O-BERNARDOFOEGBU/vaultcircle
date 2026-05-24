import { Router } from 'express'
import { validate } from '../middleware/validate.middleware'
import { protect } from '../middleware/auth.middleware'
import { registerSchema, loginSchema } from '../schemas/auth.schema'
import * as AuthController from '../controllers/auth.controller'

const router = Router()

router.post('/register', validate(registerSchema), AuthController.register)
router.post('/login', validate(loginSchema), AuthController.login)
router.post('/logout', AuthController.logout)
router.get('/me', protect, AuthController.getMe)

export default router
