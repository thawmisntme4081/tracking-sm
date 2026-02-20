import { z } from 'zod';

export const transferDateSchema = z.date({
  required_error: 'Date is required',
});
export const transferMarketValueSchema = z
  .number({ invalid_type_error: 'Market value is required' })
  .min(0, 'Market value must be 0 or higher');

export const transferSchema = z.object({
  date: transferDateSchema,
  clubId: z.preprocess((value) => {
    if (typeof value !== 'string') {
      return value;
    }
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  }, z.string().uuid('Club must be a valid UUID')),
  marketValue: transferMarketValueSchema,
  fee: z
    .number({ invalid_type_error: 'Fee is required' })
    .min(0, 'Fee must be 0 or higher'),
});

export type TransferSchema = z.infer<typeof transferSchema>;
export type TransferValidate = TransferSchema & {
  playerId: string;
};
