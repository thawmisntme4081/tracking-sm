"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldPath, useForm } from "react-hook-form";
import { toast } from "sonner";
import { savePlayer } from "@/app/actions/players";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useClubSearch } from "@/hooks/use-club-search";
import { tryCatch } from "@/lib/tryCatch";
import ComboboxField from "../common/ComboboxField";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import { type PlayerSchema, playerSchema } from "./validation";

type InputFieldConfig = {
  name: FieldPath<PlayerSchema>;
  label: string;
  type?: "text" | "number";
  parseNumber?: boolean;
};

const textFields = [
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
] satisfies InputFieldConfig[];

const numberFields = [
  {
    name: "yearOfBirth",
    label: "Year of Birth",
    type: "number",
    parseNumber: true,
  },
  {
    name: "currentValue",
    label: "Current Value",
    type: "number",
    parseNumber: true,
  },
] satisfies InputFieldConfig[];

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

  const {
    clubQuery,
    setClubQuery,
    clubOptions,
    selectedClub,
    setSelectedClub,
    clubLoading,
    clubAnchor,
    resetClubSearch,
  } = useClubSearch();

  const resetForm = () => {
    form.reset(defaultValues);
    resetClubSearch();
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
      <form onSubmit={onSubmit} className="md:grid-cols-2">
        <Card>
          <CardContent className="grid gap-6 md:grid-cols-2">
            {textFields.map((field) => (
              <InputField<PlayerSchema>
                key={field.name}
                control={form.control}
                {...field}
              />
            ))}

            <ComboboxField
              control={form.control}
              name="club"
              label="Club"
              items={clubOptions}
              value={selectedClub}
              inputValue={clubQuery}
              onInputValueChange={(value, details) => {
                if (
                  details.reason === "input-change" ||
                  details.reason === "input-clear"
                ) {
                  setClubQuery(value);
                  if (selectedClub && value !== selectedClub.name) {
                    setSelectedClub(null);
                    form.setValue("club", "", {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }
                }
              }}
              onValueChange={(club) => {
                setSelectedClub(club ?? null);
                setClubQuery(club?.name ?? "");
              }}
              getItemLabel={(club) => club?.name ?? ""}
              getItemValue={(club) => club?.id ?? ""}
              placeholder="Search club"
              showClear
              loading={clubLoading}
              emptyMessage="No clubs found"
              anchor={clubAnchor}
            />

            <SelectField<PlayerSchema, "GK" | "DF" | "MF" | "CF">
              control={form.control}
              name="position"
              label="Position"
              placeholder="Select position"
              ariaInvalid={!!form.formState.errors.position}
              options={[
                { value: "GK", label: "GK" },
                { value: "DF", label: "DF" },
                { value: "MF", label: "MF" },
                { value: "CF", label: "CF" },
              ]}
            />

            {numberFields.map((field) => (
              <InputField<PlayerSchema>
                key={field.name}
                control={form.control}
                {...field}
              />
            ))}
          </CardContent>

          <CardFooter className="gap-3">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Save Player
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              Reset
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
