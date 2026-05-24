import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import * as UserService from '../services/user.service'

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await UserService.getUserById(req.userId!)
    res.json({ success: true, data: user })
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message })
  }
}

export const updateMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await UserService.updateUser(req.userId!, req.body)
    res.json({ success: true, data: user })
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await UserService.getUserById(req.params.id as string)
    res.json({ success: true, data: user })
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message })
  }
}

export const getAllUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await UserService.getAllUsers()
    res.json({ success: true, data: users })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
}
