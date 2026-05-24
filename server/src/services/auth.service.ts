import bcrypt from 'bcryptjs'
import prisma from '../prisma/prisma'

export const register = async (name: string, email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('Email already in use')

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, bio: true, occupation: true, savingsGoal: true, createdAt: true },
  })
  return user
}

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Invalid credentials')

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw new Error('Invalid credentials')

  const { passwordHash: _, ...safeUser } = user
  return safeUser
}

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, bio: true, occupation: true, savingsGoal: true, createdAt: true },
  })
  if (!user) throw new Error('User not found')
  return user
}
