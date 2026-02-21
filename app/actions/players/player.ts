'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  type TransferValidate,
  transferSchema,
} from '@/components/AddTransfer/validation';
import {
  type UpdateValueValidate,
  updateValueSchema,
} from '@/components/UpdateValue/validation';
import prisma from '@/lib/prisma';

const updateTransferSchema = z
  .object({
    playerId: z.string().uuid('Player must be a valid UUID'),
  })
  .and(transferSchema);
const createPlayerValueSchema = updateValueSchema.extend({
  playerId: z.string().uuid('Player must be a valid UUID'),
});

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

export async function updateTransfer(rawValues: TransferValidate) {
  const values = updateTransferSchema.parse(rawValues);
  const { playerId, date, clubId, marketValue, onLoan, fee } = values;
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const utcOnLoanDate = onLoan
    ? new Date(
        Date.UTC(onLoan.getFullYear(), onLoan.getMonth(), onLoan.getDate()),
      )
    : undefined;

  try {
    await prisma.$transaction([
      prisma.playerHistory.create({
        data: {
          playerId,
          clubId,
          dateJoined: utcDate,
          onLoan: utcOnLoanDate,
          marketValue,
          buyValue: fee,
        },
      }),
      prisma.playerValue.create({
        data: {
          playerId,
          date: utcDate,
          value: marketValue,
        },
      }),
    ]);

    revalidatePath(`/players/${playerId}`);

    return {
      message: 'Transfer updated successfully',
    };
  } catch (error) {
    console.log(error);
    throw new Error('Failed to update transfer');
  }
}

export async function createPlayerValue(rawValues: UpdateValueValidate) {
  const values = createPlayerValueSchema.parse(rawValues);
  const { playerId, date, marketValue } = values;
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );

  try {
    await prisma.playerValue.create({
      data: {
        playerId,
        date: utcDate,
        value: marketValue,
      },
    });

    revalidatePath(`/players/${playerId}`);

    return {
      message: 'Player value updated successfully',
    };
  } catch (error) {
    console.log(error);
    throw new Error('Failed to update player value');
  }
}
