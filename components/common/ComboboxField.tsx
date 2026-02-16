import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type ComboboxItemOption = {
  id: string;
  name: string;
};

type ComboboxFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  data: ComboboxItemOption[];
  placeholder?: string;
  emptyText?: string;
  ariaInvalid?: boolean;
};

export default function ComboboxField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  data,
  placeholder = 'Search...',
  emptyText = 'No options found.',
  ariaInvalid,
}: ComboboxFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedItem =
          data.find((item) => item.id === field.value) ?? null;

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Combobox
              items={data}
              value={selectedItem}
              itemToStringLabel={(item) => item.name}
              itemToStringValue={(item) => item.id}
              isItemEqualToValue={(item, selected) => item.id === selected.id}
              onValueChange={(value) => field.onChange(value?.id ?? '')}
            >
              <FormControl>
                <ComboboxInput
                  placeholder={placeholder}
                  aria-invalid={ariaInvalid}
                  showClear
                />
              </FormControl>
              <ComboboxContent>
                <ComboboxEmpty>{emptyText}</ComboboxEmpty>
                <ComboboxList>
                  <ComboboxCollection>
                    {(item) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.name}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
