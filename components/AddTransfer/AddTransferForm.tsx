'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateTransfer } from '@/app/actions/players/player';
import ComboboxField from '@/components/common/ComboboxField';
import InputField from '@/components/common/InputField';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { tryCatch } from '@/lib/tryCatch';
import { cn } from '@/lib/utils';
import { type TransferSchema, transferSchema } from './validation';

type Props = {
  playerId: string;
  clubs: ClubOption[];
  onCloseDrawer?: () => void;
};

const AddTransferForm = ({ playerId, clubs, onCloseDrawer }: Props) => {
  const defaultValues: Partial<TransferSchema> = {
    date: undefined,
    clubId: '',
    marketValue: undefined,
    fee: undefined,
  };

  const form = useForm<TransferSchema>({
    resolver: zodResolver(transferSchema),
    defaultValues,
  });

  const resetForm = () => {
    form.reset(defaultValues);
    onCloseDrawer?.();
  };

  const onSubmit = form.handleSubmit(async (data: TransferSchema) => {
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

  // Todo: loan

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 p-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, 'PPP')
                          : 'Pick a date'}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
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

          <InputField<TransferSchema>
            control={form.control}
            name="marketValue"
            label="Market Value"
            type="number"
            parseNumber
          />

          <InputField<TransferSchema>
            control={form.control}
            name="fee"
            label="Fee"
            type="number"
            parseNumber
          />
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
