import prisma from '@/lib/prisma';

export const getPlayerHistories = async (playerId: string) => {
  return await prisma.playerHistory.findMany({
    where: { playerId },
    orderBy: { eventDate: 'desc' },
    select: {
      id: true,
      type: true,
      eventDate: true,
      fee: true,
      marketValue: true,
      fromClub: {
        select: {
          name: true,
        },
      },
      toClub: {
        select: {
          name: true,
        },
      },
      loanParent: {
        select: {
          name: true,
        },
      },
      loanEndAt: true,
    },
  });
};
