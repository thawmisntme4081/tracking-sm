"use server";

import {
  type PlayerSchema,
  playerSchema,
} from "@/components/AddPlayer/validation";
import prisma from "@/lib/prisma";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function savePlayer(values: PlayerSchema) {
  const { firstName, lastName, yearOfBirth, position, currentValue, club } =
    values;
  const clubId = club?.trim() ? club : null;
  try {
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
                  date: new Date("2025-07-11"),
                },
              },
            }
          : {}),
        ...(clubId
          ? {
              histories: {
                create: {
                  clubId: clubId,
                  dateJoined: new Date("2025-07-11"),
                },
              },
            }
          : {}),
      },
    });

    return {
      message: "Store player successfully",
    };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to store player");
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
  const errors: ImportPlayersResult["errors"] = [];
  const createOps: ReturnType<typeof prisma.player.create>[] = [];

  for (const [index, row] of rows.entries()) {
    const parsed = playerSchema.safeParse(row);
    if (!parsed.success) {
      errors.push({
        row: index + 2,
        message: parsed.error.errors[0]?.message ?? "Invalid row data",
      });
      continue;
    }

    const normalizedClub = parsed.data.club?.trim();
    let clubId: string | null = null;

    if (normalizedClub) {
      if (uuidRegex.test(normalizedClub)) {
        const club = await prisma.club.findUnique({
          where: { id: normalizedClub },
          select: { id: true },
        });
        if (!club) {
          errors.push({
            row: index + 2,
            message: `Club id not found: ${normalizedClub}`,
          });
          continue;
        }
        clubId = club.id;
      } else {
        const club = await prisma.club.findFirst({
          where: {
            name: {
              equals: normalizedClub,
              mode: "insensitive",
            },
          },
          select: { id: true },
        });
        if (!club) {
          errors.push({
            row: index + 2,
            message: `Club name not found: ${normalizedClub}`,
          });
          continue;
        }
        clubId = club.id;
      }
    }

    const dateJoined = new Date("2025-07-11");
    createOps.push(
      prisma.player.create({
        data: {
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          yearOfBirth: parsed.data.yearOfBirth,
          position: parsed.data.position,
          values: {
            create: {
              value: parsed.data.currentValue,
              date: dateJoined,
            },
          },
          ...(clubId
            ? {
                histories: {
                  create: {
                    clubId,
                    dateJoined,
                  },
                },
              }
            : {}),
        },
      }),
    );
  }

  if (createOps.length > 0) {
    await prisma.$transaction(createOps);
  }

  return {
    createdCount: createOps.length,
    errorCount: errors.length,
    errors,
  };
}
