'use server';

import {
  type PlayerSchema,
  playerSchema,
} from '@/components/AddPlayer/validation';
import { INIT_DATE } from '@/constants';
import prisma from '@/lib/prisma';

export async function savePlayer(values: PlayerSchema) {
  const { firstName, lastName, yearOfBirth, position, currentValue, clubId } =
    values;

  try {
    const eventDate = new Date(INIT_DATE);
    await prisma.player.create({
      data: {
        firstName,
        lastName,
        yearOfBirth,
        position,
        ...(currentValue !== undefined && currentValue !== null
          ? {
              values: {
                create: {
                  value: currentValue,
                  date: new Date(INIT_DATE),
                },
              },
            }
          : {}),
        histories: {
          create: {
            toClubId: clubId?.trim() ?? null,
            eventDate,
            marketValue: currentValue,
          },
        },
      },
    });

    return {
      message: 'Store player successfully',
    };
  } catch (error) {
    console.log(error);
    throw new Error('Failed to store player');
  }
}

export type ImportPlayersResult = {
  createdCount: number;
  errorCount: number;
  errors: { row: number; message: string }[];
};

export async function importPlayersFromCsv(
  rows: PlayerSchema[],
): Promise<ImportPlayersResult> {
  const errors: ImportPlayersResult['errors'] = [];
  const clubExistsCache = new Map<string, boolean>();
  let createdCount = 0;

  for (const [index, row] of rows.entries()) {
    const parsed = playerSchema.safeParse(row);
    if (!parsed.success) {
      errors.push({
        row: index + 2,
        message: parsed.error.errors[0]?.message ?? 'Invalid row data',
      });
      continue;
    }

    const {
      clubId,
      firstName,
      lastName,
      yearOfBirth,
      position,
      currentValue: value,
    } = parsed.data;

    if (clubId) {
      const clubKey = clubId.toLowerCase();
      if (!clubExistsCache.has(clubKey)) {
        const club = await prisma.club.findUnique({
          where: { id: clubId },
          select: { id: true },
        });
        clubExistsCache.set(clubKey, Boolean(club));
      }

      if (!clubExistsCache.get(clubKey)) {
        errors.push({
          row: index + 2,
          message: `Club id not found: ${clubId}`,
        });
        continue;
      }
    }

    try {
      const eventDate = new Date(INIT_DATE);
      await prisma.player.create({
        data: {
          firstName,
          lastName,
          yearOfBirth,
          position,
          values: {
            create: {
              value,
              date: eventDate,
            },
          },
          histories: {
            create: {
              toClubId: clubId ?? null,
              eventDate,
              marketValue: value,
            },
          },
        },
      });
      createdCount += 1;
    } catch {
      errors.push({
        row: index + 2,
        message: 'Failed to create player',
      });
    }
  }

  return {
    createdCount,
    errorCount: errors.length,
    errors,
  };
}

export async function getPlayersForTable() {
  return prisma.player.findMany({
    orderBy: [{ updatedAt: 'desc' }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      yearOfBirth: true,
      position: true,
      isRetired: true,
      histories: {
        orderBy: { eventDate: 'desc' },
        take: 1,
        select: {
          toClub: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      values: {
        orderBy: { date: 'desc' },
        take: 1,
        select: {
          value: true,
          date: true,
        },
      },
    },
  });
}
