import type { z } from 'zod';
import { transferSchema } from '@/components/AddTransfer/validation';

export const updateValueSchema = transferSchema.pick({
  date: true,
  marketValue: true,
});

export type UpdateValueSchema = z.infer<typeof updateValueSchema>;
export type UpdateValueValidate = UpdateValueSchema & {
  playerId: string;
};
