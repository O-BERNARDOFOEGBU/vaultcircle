import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'

export interface AuthRequest extends Request {
  userId?: string
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies?.token

    if (!token) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
      return
    }

    const decoded = verifyToken(token)
    req.userId = decoded.userId
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
}