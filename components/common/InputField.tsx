import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

type InputFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  type?: "text" | "number";
  parseNumber?: boolean;
};

export default function InputField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  parseNumber = false,
}: InputFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              {...field}
              value={field.value ?? ""}
              onChange={
                parseNumber
                  ? (event) =>
                      field.onChange(
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                      )
                  : field.onChange
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
