import { z } from 'zod';

export const transferDateSchema = z.date({
  required_error: 'Date is required',
});
export const transferMarketValueSchema = z
  .number({ invalid_type_error: 'Market value is required' })
  .min(0, 'Market value must be 0 or higher');

export const transferBaseSchema = z.object({
  date: transferDateSchema,
  clubId: z.preprocess((value) => {
    if (typeof value !== 'string') {
      return value;
    }
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  }, z.string().uuid('Club must be a valid UUID').optional()),
  marketValue: transferMarketValueSchema,
  onLoan: z.date().optional(),
  fee: z.number().min(0, 'Fee must be 0 or higher').optional(),
});

export const transferSchema = transferBaseSchema.superRefine((values, ctx) => {
  if (values.onLoan && values.fee !== undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Use either Loan Until or Fee, not both',
      path: ['onLoan'],
    });
  }
});

export type TransferSchema = z.infer<typeof transferSchema>;
export type TransferValidate = TransferSchema & {
  playerId: string;
};
