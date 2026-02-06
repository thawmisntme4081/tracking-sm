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
    const { id } = await prisma.player.create({
      data: {
        firstName,
        lastName,
        yearOfBirth,
        position,
        values: {
          create: {
            value: currentValue,
            date: new Date(),
          },
        },
      },
    });

    console.log(id);

    return {
      message: "Store player successfully",
    };
  } catch {
    throw new Error("Failed to store player");
  }
}
