import { z } from 'zod';

export const playerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  clubId: z.preprocess((value) => {
    if (typeof value !== 'string') {
      return value;
    }
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  }, z.string().uuid('Club must be a valid UUID').optional()),
  yearOfBirth: z
    .number({ invalid_type_error: 'Year of birth is required' })
    .int('Year of birth must be a whole number')
    .min(1900, 'Year of birth must be 1900 or later')
    .max(new Date().getFullYear(), 'Year of birth cannot be in the future'),
  position: z.enum(['GK', 'DF', 'MF', 'CF'], {
    errorMap: () => ({ message: 'Position is required' }),
  }),
  currentValue: z
    .number({ invalid_type_error: 'Current value is required' })
    .min(0, 'Current value must be 0 or higher'),
});

export type PlayerSchema = z.infer<typeof playerSchema>;
