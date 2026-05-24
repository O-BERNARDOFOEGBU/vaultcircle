import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import * as CircleService from '../services/circle.service'

export const createCircle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, targetAmount } = req.body
    const circle = await CircleService.createCircle(name, description, targetAmount, req.userId!)
    res.status(201).json({ success: true, data: circle })
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const getAllCircles = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const circles = await CircleService.getAllCircles()
    res.json({ success: true, data: circles })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const getCircleById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const circle = await CircleService.getCircleById(req.params.id as string)
    res.json({ success: true, data: circle })
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message })
  }
}

export const joinCircle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const membership = await CircleService.joinCircle(req.params.id as string, req.userId!)
    res.status(201).json({ success: true, data: membership })
  } catch (err: any) {
    const status = err.message === 'Circle not found' ? 404 : 409
    res.status(status).json({ success: false, message: err.message })
  }
}

export const leaveCircle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await CircleService.leaveCircle(req.params.id as string, req.userId!)
    res.json({ success: true, data: null })
  } catch (err: any) {
    const status = err.message === 'You are not a member of this circle' ? 404 : 403
    res.status(status).json({ success: false, message: err.message })
  }
}
