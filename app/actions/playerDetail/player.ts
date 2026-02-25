'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  type TransferValidate,
  transferSchema,
} from '@/components/AddTransfer/validation';
import {
  createPlayerValueSchema,
  type UpdateValueValidate,
} from '@/components/UpdateValue/validation';
import prisma from '@/lib/prisma';

const updateTransferSchema = z
  .object({
    playerId: z.string().uuid('Player must be a valid UUID'),
  })
  .and(transferSchema);

export const getPLayer = async (id: string) => {
  return await prisma.player.findUnique({
    where: { id },
    select: {
      firstName: true,
      lastName: true,
      isRetired: true,
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
  const { playerId, date, clubId, marketValue, onLoan, fee, type } = values;
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const utcOnLoanDate = onLoan
    ? new Date(
        Date.UTC(onLoan.getFullYear(), onLoan.getMonth(), onLoan.getDate()),
      )
    : undefined;

  try {
    await prisma.$transaction(async (tx) => {
      const player = await tx.player.findUnique({
        where: { id: playerId },
        select: { id: true },
      });

      const destinationClub = clubId
        ? await tx.club.findUnique({
            where: { id: clubId },
            select: { id: true },
          })
        : null;

      if (!player) {
        throw new Error('Player not found');
      }

      if (clubId && !destinationClub) {
        throw new Error('Destination club not found');
      }

      const latestTransfer = await tx.playerHistory.findFirst({
        where: {
          playerId,
          eventDate: {
            lte: utcDate,
          },
        },
        orderBy: [{ eventDate: 'desc' }],
        select: {
          type: true,
          loanParentId: true,
          toClubId: true,
        },
      });

      const resolvedFromClubId =
        latestTransfer?.type === 'LOAN'
          ? (latestTransfer.loanParentId ?? null)
          : (latestTransfer?.toClubId ?? null);

      if (clubId && resolvedFromClubId && resolvedFromClubId === clubId) {
        throw new Error('Destination club cannot be the same as source club');
      }

      const loanParentId = type === 'LOAN' ? resolvedFromClubId : null;

      await tx.playerHistory.create({
        data: {
          playerId,
          type,
          eventDate: utcDate,
          fromClubId: resolvedFromClubId,
          toClubId: clubId ?? null,
          loanParentId,
          loanEndAt: type === 'LOAN' ? utcOnLoanDate : null,
          fee: type === 'TRANSFER' ? fee : null,
          marketValue,
        },
      });

      await tx.playerValue.create({
        data: {
          playerId,
          date: utcDate,
          value: marketValue,
        },
      });
    });

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
  const utcDate = new Date(date);

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
