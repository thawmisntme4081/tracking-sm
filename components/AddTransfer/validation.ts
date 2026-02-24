import { z } from 'zod';

export const transferTypeSchema = z.enum(['TRANSFER', 'LOAN'], {
  required_error: 'Transfer type is required',
});
export const transferDateSchema = z.date({
  required_error: 'Date is required',
});
export const transferMarketValueSchema = z
  .number({ invalid_type_error: 'Market value is required' })
  .min(0, 'Market value must be 0 or higher');

export const transferBaseSchema = z.object({
  type: transferTypeSchema,
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
  if (values.type === 'LOAN') {
    if (!values.onLoan) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Loan end date is required for loan transfer',
        path: ['onLoan'],
      });
    }

    if (values.onLoan && values.onLoan < values.date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Loan end date must be on or after transfer date',
        path: ['onLoan'],
      });
    }

    if (values.fee !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Fee is not allowed for loan transfer',
        path: ['fee'],
      });
    }
  }

  if (values.type === 'TRANSFER' && values.onLoan) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Loan end date is not allowed for permanent transfer',
      path: ['onLoan'],
    });
  }

  if (values.type === 'LOAN' && !values.clubId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Club is required for loan transfer',
      path: ['clubId'],
    });
  }
});

export type TransferSchema = z.infer<typeof transferSchema>;
export type TransferValidate = TransferSchema & {
  playerId: string;
};
