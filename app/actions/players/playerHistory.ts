import prisma from '@/lib/prisma';

export const getPlayerHistories = async (playerId: string) => {
  return await prisma.playerHistory.findMany({
    where: { playerId },
    orderBy: { dateJoined: 'desc' },
    select: {
      id: true,
      dateJoined: true,
      buyValue: true,
      marketValue: true,
      club: {
        select: {
          name: true,
        },
      },
    },
  });
};
