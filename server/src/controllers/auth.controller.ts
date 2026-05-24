import { Request, Response } from 'express'
import { signToken } from '../utils/jwt'
import * as AuthService from '../services/auth.service'
import { AuthRequest } from '../middleware/auth.middleware'

// const COOKIE_OPTIONS = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production',
//   sameSite: 'lax' as const,
//   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
// }

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body
    const user = await AuthService.register(name, email, password)
    const token = signToken(user.id)
    res.cookie('token', token, COOKIE_OPTIONS)
    res.status(201).json({ success: true, data: user })
  } catch (err: any) {
    const status = err.message === 'Email already in use' ? 409 : 400
    res.status(status).json({ success: false, message: err.message })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    const user = await AuthService.login(email, password)
    const token = signToken(user.id)
    res.cookie('token', token, COOKIE_OPTIONS)
    res.json({ success: true, data: user })
  } catch (err: any) {
    res.status(401).json({ success: false, message: err.message })
  }
}

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('token')
  res.json({ success: true, data: null })
}

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await AuthService.getMe(req.userId!)
    res.json({ success: true, data: user })
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message })
  }
}
