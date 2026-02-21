import type { z } from 'zod';
import { transferBaseSchema } from '@/components/AddTransfer/validation';

export const updateValueSchema = transferBaseSchema.pick({
  date: true,
  marketValue: true,
});

export type UpdateValueSchema = z.infer<typeof updateValueSchema>;
export type UpdateValueValidate = UpdateValueSchema & {
  playerId: string;
};
