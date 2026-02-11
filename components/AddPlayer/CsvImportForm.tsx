"use client";

import { importPlayersFromCsv } from "@/app/actions/players";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { toast } from "sonner";

type CsvRow = {
  firstName: string;
  lastName: string;
  yearOfBirth: number;
  club?: string;
  position: "GK" | "DF" | "MF" | "CF";
  currentValue: number;
};

const requiredColumns = [
  "firstName",
  "lastName",
  "yearOfBirth",
  "club",
  "position",
  "currentValue",
] as const;

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === "\"") {
      if (inQuotes && nextChar === "\"") {
        current += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function parseCsv(text: string) {
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => parseCsvLine(line));

  return { headers, rows };
}

export default function CsvImportForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      toast.error("Please select a CSV file first.");
      return;
    }

    setIsUploading(true);
    try {
      const text = await file.text();
      const { headers, rows } = parseCsv(text);

      if (headers.length === 0) {
        toast.error("CSV file is empty.");
        return;
      }

      const normalizedHeaders = headers.map((header) => header.trim());
      const missingColumns = requiredColumns.filter(
        (column) => !normalizedHeaders.includes(column),
      );

      if (missingColumns.length > 0) {
        toast.error(
          `Missing required columns: ${missingColumns.join(", ")}`,
        );
        return;
      }

      const headerIndex = Object.fromEntries(
        normalizedHeaders.map((header, index) => [header, index]),
      );

      const parsedRows: CsvRow[] = rows.map((row) => ({
        firstName: row[headerIndex.firstName] ?? "",
        lastName: row[headerIndex.lastName] ?? "",
        yearOfBirth: Number(row[headerIndex.yearOfBirth] ?? ""),
        club: row[headerIndex.club] ?? undefined,
        position: (row[headerIndex.position] ?? "").toUpperCase() as CsvRow["position"],
        currentValue: Number(row[headerIndex.currentValue] ?? ""),
      }));

      const result = await importPlayersFromCsv(parsedRows);

      if (result.createdCount > 0) {
        toast.success(`Imported ${result.createdCount} player(s).`);
      }

      if (result.errorCount > 0) {
        const preview = result.errors
          .slice(0, 3)
          .map((error) => `Row ${error.row}: ${error.message}`)
          .join(" | ");
        toast.error(`Failed ${result.errorCount} row(s). ${preview}`);
      }

      if (result.createdCount === 0 && result.errorCount === 0) {
        toast.info("No rows to import.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to import CSV.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CSV Import</CardTitle>
        <CardDescription>
          Upload a CSV file with columns: firstName, lastName, yearOfBirth,
          club, position, currentValue.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="csvFile">CSV File</Label>
          <Input id="csvFile" type="file" accept=".csv" ref={inputRef} />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="button" onClick={handleUpload} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </CardFooter>
    </Card>
  );
}
