'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateTransfer } from '@/app/actions/playerDetail/player';
import ComboboxField from '@/components/common/ComboboxField';
import InputField from '@/components/common/InputField';
import SelectField from '@/components/common/SelectField';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatDateInput } from '@/lib/format';
import { tryCatch } from '@/lib/tryCatch';
import { type TransferSchemaInput, transferFormSchema } from './validation';

type Props = {
  playerId: string;
  clubs: ClubOption[];
  onCloseDrawer?: () => void;
};

const AddTransferForm = ({ playerId, clubs, onCloseDrawer }: Props) => {
  const defaultValues: Partial<TransferSchemaInput> = {
    type: 'TRANSFER',
    date: '',
    clubId: '',
    marketValue: undefined,
    onLoan: undefined,
    fee: undefined,
  };

  const form = useForm<TransferSchemaInput>({
    resolver: zodResolver(transferFormSchema),
    defaultValues,
  });

  const resetForm = () => {
    form.reset(defaultValues);
    onCloseDrawer?.();
  };

  const onSubmit = form.handleSubmit(async (data: TransferSchemaInput) => {
    const [response, error] = await tryCatch(
      updateTransfer({ ...data, playerId }),
    );
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(response.message);
    resetForm();
  });

  const transferType = form.watch('type');

  useEffect(() => {
    if (transferType === 'LOAN') {
      form.setValue('fee', undefined, { shouldValidate: true });
      return;
    }

    form.setValue('onLoan', undefined, { shouldValidate: true });
  }, [form, transferType]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 p-4">
          <SelectField<TransferSchemaInput, 'TRANSFER' | 'LOAN'>
            control={form.control}
            name="type"
            label="Type"
            placeholder="Select transfer type"
            ariaInvalid={!!form.formState.errors.type}
            options={[
              { value: 'TRANSFER', label: 'Permanent Transfer' },
              { value: 'LOAN', label: 'Loan Transfer' },
            ]}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="YYYY-MM-DD"
                    value={field.value ?? ''}
                    onChange={(event) =>
                      field.onChange(formatDateInput(event.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ComboboxField
            control={form.control}
            name="clubId"
            label="Club"
            placeholder="Search club..."
            emptyText="No clubs found."
            ariaInvalid={!!form.formState.errors.clubId}
            data={clubs}
          />

          <InputField<TransferSchemaInput>
            control={form.control}
            name="marketValue"
            label="Market Value"
            type="number"
            parseNumber
          />

          {transferType === 'LOAN' && (
            <FormField
              control={form.control}
              name="onLoan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Until</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="YYYY-MM-DD"
                      value={field.value ?? ''}
                      onChange={(event) =>
                        field.onChange(formatDateInput(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {transferType === 'TRANSFER' && (
            <FormField
              control={form.control}
              name="fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? ''}
                      onChange={(event) => {
                        const value =
                          event.target.value === ''
                            ? undefined
                            : Number(event.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="p-4 flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save Transfer
          </Button>
          <Button type="button" variant="secondary" onClick={resetForm}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddTransferForm;
