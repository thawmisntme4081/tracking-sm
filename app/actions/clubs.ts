"use server";

import prisma from "@/lib/prisma";

export async function getClubs(query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  return await prisma.club.findMany({
    where: {
      name: {
        contains: trimmed,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
    },
    take: 10,
    orderBy: {
      name: "asc",
    },
  });
}
