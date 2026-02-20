'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createPlayerValue } from '@/app/actions/players/player';
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
import { type UpdateValueSchema, updateValueSchema } from './validation';

type Props = {
  playerId: string;
  onCloseDrawer?: () => void;
};

const UpdateValueForm = ({ playerId, onCloseDrawer }: Props) => {
  const defaultValues: Partial<UpdateValueSchema> = {
    date: undefined,
    marketValue: undefined,
  };

  const form = useForm<UpdateValueSchema>({
    resolver: zodResolver(updateValueSchema),
    defaultValues,
  });

  const resetForm = () => {
    form.reset(defaultValues);
    onCloseDrawer?.();
  };

  const onSubmit = form.handleSubmit(async (data: UpdateValueSchema) => {
    const [response, error] = await tryCatch(
      createPlayerValue({ ...data, playerId }),
    );

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(response.message);
    resetForm();
  });

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

          <InputField<UpdateValueSchema>
            control={form.control}
            name="marketValue"
            label="Value"
            type="number"
            parseNumber
          />
        </div>

        <div className="p-4 flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save Value
          </Button>
          <Button type="button" variant="secondary" onClick={resetForm}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateValueForm;
