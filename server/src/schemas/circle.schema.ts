import { z } from 'zod'

export const createCircleSchema = z.object({
  name: z.string().min(2, 'Circle name must be at least 2 characters'),
  description: z.string().optional(),
  targetAmount: z.number().positive().optional(),
})

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
  occupation: z.string().optional(),
  savingsGoal: z.number().positive().optional(),
})