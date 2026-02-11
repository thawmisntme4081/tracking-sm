import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type React from "react";
import {
  type Control,
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
} from "react-hook-form";

type InputValueChangeDetails = {
  reason?: string;
};

type ComboboxFieldProps<
  TFieldValues extends FieldValues,
  TItem,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  items: TItem[];
  value: TItem | null;
  inputValue: string;
  onInputValueChange: (value: string, details: InputValueChangeDetails) => void;
  onValueChange?: (item: TItem | null) => void;
  valueToFormValue?: (
    item: TItem | null,
  ) => FieldPathValue<TFieldValues, TName>;
  getItemLabel: (item: TItem | null) => string;
  getItemValue: (item: TItem | null) => string;
  renderItem?: (item: TItem) => React.ReactNode;
  placeholder?: string;
  showClear?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  anchor?: React.RefObject<HTMLDivElement | null>;
};

export default function ComboboxField<
  TFieldValues extends FieldValues,
  TItem,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  items,
  value,
  inputValue,
  onInputValueChange,
  onValueChange,
  valueToFormValue,
  getItemLabel,
  getItemValue,
  renderItem,
  placeholder,
  showClear = false,
  loading = false,
  emptyMessage = "No results found",
  loadingMessage = "Loading...",
  anchor,
}: ComboboxFieldProps<TFieldValues, TItem, TName>) {
  const emptyLabel = loading ? loadingMessage : emptyMessage;
  const toFormValue =
    valueToFormValue ??
    ((item: TItem | null) =>
      getItemValue(item) as FieldPathValue<TFieldValues, TName>);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div ref={anchor} className="w-full">
              <Combobox
                items={items}
                value={value}
                inputValue={inputValue}
                itemToStringLabel={getItemLabel}
                itemToStringValue={getItemValue}
                onInputValueChange={onInputValueChange}
                onValueChange={(item) => {
                  onValueChange?.(item);
                  field.onChange(toFormValue(item));
                }}
              >
                <ComboboxInput placeholder={placeholder} showClear={showClear} />
                <ComboboxContent anchor={anchor}>
                  <ComboboxList>
                    <ComboboxCollection>
                      {(item) => (
                        <ComboboxItem
                          key={getItemValue(item)}
                          value={item}
                        >
                          {renderItem ? renderItem(item) : getItemLabel(item)}
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>
                    <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
