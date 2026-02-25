import { z } from 'zod';
import { isoDatePattern, isValidCalendarDate, toUtcDate } from '@/lib/date';

export const transferTypeSchema = z.enum(['TRANSFER', 'LOAN'], {
  required_error: 'Transfer type is required',
});
export const transferMarketValueSchema = z
  .number({ invalid_type_error: 'Market value is required' })
  .min(0, 'Market value must be 0 or higher');

const transferDateStringSchema = z
  .string({ required_error: 'Date is required' })
  .min(1, 'Date is required')
  .regex(isoDatePattern, 'Date must be in YYYY-MM-DD format')
  .refine(isValidCalendarDate, {
    message: 'Date is not a valid calendar date',
  });

export const transferDateSchema = transferDateStringSchema.transform(toUtcDate);

const transferOnLoanStringSchema = z
  .string()
  .regex(isoDatePattern, 'Date must be in YYYY-MM-DD format')
  .refine(isValidCalendarDate, {
    message: 'Date is not a valid calendar date',
  })
  .optional();

const transferOnLoanSchema = transferOnLoanStringSchema.transform((value) =>
  value ? toUtcDate(value) : undefined,
);

const transferBaseSchema = z.object({
  type: transferTypeSchema,
  date: transferDateStringSchema,
  clubId: z.preprocess((value) => {
    if (typeof value !== 'string') {
      return value;
    }
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  }, z.string().uuid('Club must be a valid UUID').optional()),
  marketValue: transferMarketValueSchema,
  onLoan: transferOnLoanStringSchema,
  fee: z.number().min(0, 'Fee must be 0 or higher').optional(),
});

export const transferFormSchema = transferBaseSchema.superRefine(
  (values, ctx) => {
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
  },
);

const transferParsedBaseSchema = z.object({
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
  onLoan: transferOnLoanSchema,
  fee: z.number().min(0, 'Fee must be 0 or higher').optional(),
});

export const transferSchema = transferParsedBaseSchema.superRefine(
  (values, ctx) => {
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
  },
);

export type TransferSchemaInput = z.infer<typeof transferFormSchema>;
export type TransferSchema = z.output<typeof transferSchema>;
export type TransferValidate = TransferSchemaInput & {
  playerId: string;
};
