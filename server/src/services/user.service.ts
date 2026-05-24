import prisma from '../prisma/prisma'

const safeSelect = {
  id: true,
  name: true,
  email: true,
  bio: true,
  occupation: true,
  savingsGoal: true,
  createdAt: true,
} as const

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id }, select: safeSelect })
  if (!user) throw new Error('User not found')
  return user
}

export const getAllUsers = async () => {
  return prisma.user.findMany({ select: safeSelect, orderBy: { createdAt: 'desc' } })
}

export const updateUser = async (
  id: string,
  data: { name?: string; bio?: string; occupation?: string; savingsGoal?: number }
) => {
  const user = await prisma.user.update({ where: { id }, data, select: safeSelect })
  return user
}
