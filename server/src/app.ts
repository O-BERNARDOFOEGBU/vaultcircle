import express, { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { setupLogger } from './utils/logger'
import { errorHandler } from './middleware/error.middleware'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import circleRoutes from './routes/circle.routes'

const app = express()

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://vaultcircle-tau.vercel.app',
]

// app.use((req: Request, res: Response, next: NextFunction) => {
//   const origin = req.headers.origin as string
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin)
//   }
//   res.setHeader('Access-Control-Allow-Credentials', 'true')
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
//   if (req.method === 'OPTIONS') {
//     res.sendStatus(204)
//     return
//   }
//   next()
// })

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin as string
  const isAllowed =
    origin === 'http://localhost:3000' ||
    origin === 'http://localhost:3001' ||
    (origin && origin.endsWith('.vercel.app'))
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }
  next()
})

app.use(cookieParser())
app.use(express.json())
setupLogger(app)

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many requests, please try again later.' },
  skip: (req) => req.method === 'OPTIONS',
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/circles', circleRoutes)
app.use(errorHandler)

export default app