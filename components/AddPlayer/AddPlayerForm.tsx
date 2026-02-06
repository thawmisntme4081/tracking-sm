"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { savePlayer } from "@/app/actions/players";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tryCatch } from "@/lib/tryCatch";
import { type PlayerSchema, playerSchema } from "./validation";

export default function AddPlayerForm() {
  const defaultValues: Partial<PlayerSchema> = {
    firstName: "",
    lastName: "",
    club: "",
    yearOfBirth: undefined,
    position: undefined,
    currentValue: undefined,
  };

  const form = useForm<PlayerSchema>({
    resolver: zodResolver(playerSchema),
    defaultValues,
  });

  const resetForm = () => {
    form.reset(defaultValues);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const [response, error] = await tryCatch(savePlayer(values));
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(response.message);
    resetForm();
  });

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="grid gap-6 border bg-background p-6 shadow-sm md:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yearOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year of Birth</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="club"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Club</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GK">GK</SelectItem>
                    <SelectItem value="DF">DF</SelectItem>
                    <SelectItem value="MF">MF</SelectItem>
                    <SelectItem value="CF">CF</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Value</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3 md:col-span-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save Player
          </Button>
          <Button type="button" variant="secondary" onClick={resetForm}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
