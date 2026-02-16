import prisma from '@/lib/prisma';

export const getPLayer = async (id: string) => {
  return await prisma.player.findUnique({
    where: { id },
    select: {
      firstName: true,
      lastName: true,
      values: {
        orderBy: { date: 'asc' },
        select: {
          date: true,
          value: true,
        },
      },
    },
  });
};
