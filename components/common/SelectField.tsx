import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

type SelectOption<TValue extends string> = {
  value: TValue;
  label: string;
};

type SelectFieldProps<
  TFieldValues extends FieldValues,
  TValue extends string,
> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  options: SelectOption<TValue>[];
  placeholder?: string;
  ariaInvalid?: boolean;
};

export default function SelectField<
  TFieldValues extends FieldValues,
  TValue extends string,
>({
  control,
  name,
  label,
  options,
  placeholder,
  ariaInvalid,
}: SelectFieldProps<TFieldValues, TValue>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger className="w-full" aria-invalid={ariaInvalid}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
