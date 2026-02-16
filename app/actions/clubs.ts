'use server';

import prisma from '@/lib/prisma';

export async function getClubs() {
  return await prisma.club.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}
