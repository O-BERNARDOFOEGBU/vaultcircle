import prisma from '../prisma/prisma'

export const createCircle = async (
  name: string,
  description: string | undefined,
  targetAmount: number | undefined,
  ownerId: string
) => {
  const circle = await prisma.circle.create({
    data: {
      name,
      description,
      targetAmount,
      ownerId,
      members: { create: { userId: ownerId, role: 'OWNER' } },
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      _count: { select: { members: true } },
    },
  })
  return circle
}

export const getAllCircles = async () => {
  return prisma.circle.findMany({
    include: {
      owner: { select: { id: true, name: true, email: true } },
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export const getCircleById = async (id: string) => {
  const circle = await prisma.circle.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { joinedAt: 'asc' },
      },
    },
  })
  if (!circle) throw new Error('Circle not found')
  return circle
}

export const joinCircle = async (circleId: string, userId: string) => {
  const circle = await prisma.circle.findUnique({ where: { id: circleId } })
  if (!circle) throw new Error('Circle not found')

  const existing = await prisma.membership.findUnique({ where: { userId_circleId: { userId, circleId } } })
  if (existing) throw new Error('Already a member of this circle')

  return prisma.membership.create({
    data: { userId, circleId, role: 'MEMBER' },
    include: { circle: true, user: { select: { id: true, name: true, email: true } } },
  })
}

export const leaveCircle = async (circleId: string, userId: string) => {
  const membership = await prisma.membership.findUnique({
    where: { userId_circleId: { userId, circleId } },
  })
  if (!membership) throw new Error('You are not a member of this circle')
  if (membership.role === 'OWNER') throw new Error('Owner cannot leave the circle')

  await prisma.membership.delete({ where: { userId_circleId: { userId, circleId } } })
}
