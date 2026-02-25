'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createPlayerValue } from '@/app/actions/playerDetail/player';
import InputField from '@/components/common/InputField';
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
import {
  type UpdateValueSchemaInput,
  updateValueFormSchema,
} from './validation';

type Props = {
  playerId: string;
  onCloseDrawer?: () => void;
};

const UpdateValueForm = ({ playerId, onCloseDrawer }: Props) => {
  const defaultValues: Partial<UpdateValueSchemaInput> = {
    date: '',
    marketValue: undefined,
  };

  const form = useForm<UpdateValueSchemaInput>({
    resolver: zodResolver(updateValueFormSchema),
    defaultValues,
  });

  const resetForm = () => {
    form.reset(defaultValues);
    onCloseDrawer?.();
  };

  const onSubmit = form.handleSubmit(async (data: UpdateValueSchemaInput) => {
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

          <InputField<UpdateValueSchemaInput>
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
