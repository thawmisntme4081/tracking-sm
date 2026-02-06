"use server";

import type { PlayerSchema } from "@/components/AddPlayer/validation";
import prisma from "@/lib/prisma";

export async function savePlayer(values: PlayerSchema) {
  const {
    firstName,
    lastName,
    yearOfBirth,
    position,
    currentValue,
    club: clubId,
  } = values;
  try {
    await prisma.player.create({
      data: {
        firstName,
        lastName,
        yearOfBirth,
        position,
        values: {
          create: {
            value: currentValue,
            date: new Date("2025-07-11"),
          },
        },
        histories: {
          create: {
            clubId,
            dateJoined: new Date("2025-07-11"),
          },
        },
      },
    });

    return {
      message: "Store player successfully",
    };
  } catch {
    throw new Error("Failed to store player");
  }
}
