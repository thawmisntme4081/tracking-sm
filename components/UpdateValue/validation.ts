import { z } from 'zod';
import { isoDatePattern, isValidCalendarDate, toUtcDate } from '@/lib/date';

const updateValueDateStringSchema = z
  .string({ required_error: 'Date is required' })
  .min(1, 'Date is required')
  .regex(isoDatePattern, 'Date must be in YYYY-MM-DD format')
  .refine(isValidCalendarDate, {
    message: 'Date is not a valid calendar date',
  });

const updateValueDateInputSchema =
  updateValueDateStringSchema.transform(toUtcDate);

const updateValueMarketValueSchema = z
  .number({ invalid_type_error: 'Value is required' })
  .min(0, 'Value must be 0 or higher');

export const updateValueFormSchema = z.object({
  date: updateValueDateStringSchema,
  marketValue: updateValueMarketValueSchema,
});

export const createPlayerValueSchema = updateValueFormSchema.extend({
  playerId: z.string().uuid('Player must be a valid UUID'),
});

export type UpdateValueSchemaInput = z.infer<typeof updateValueFormSchema>;
export type UpdateValueValidate = z.infer<typeof createPlayerValueSchema>;
