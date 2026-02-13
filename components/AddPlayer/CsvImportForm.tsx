'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { importPlayersFromCsv } from '@/app/actions/players';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parseCsv } from './csv';

type CsvRow = {
  firstName: string;
  lastName: string;
  yearOfBirth: number;
  club?: string;
  position: 'GK' | 'DF' | 'MF' | 'CF';
  currentValue: number;
};

const requiredColumns = [
  'firstName',
  'lastName',
  'yearOfBirth',
  'club',
  'position',
  'currentValue',
] as const;

export default function CsvImportForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      toast.error('Please select a CSV file first.');
      return;
    }

    setIsUploading(true);
    try {
      const text = await file.text();
      const { headers, rows } = parseCsv(text);

      if (headers.length === 0) {
        toast.error('CSV file is empty.');
        return;
      }

      const normalizedHeaders = headers.map((header) => header.trim());
      const missingColumns = requiredColumns.filter(
        (column) => !normalizedHeaders.includes(column),
      );

      if (missingColumns.length > 0) {
        toast.error(`Missing required columns: ${missingColumns.join(', ')}`);
        return;
      }

      const headerIndex = Object.fromEntries(
        normalizedHeaders.map((header, index) => [header, index]),
      );

      const parsedRows: CsvRow[] = rows.map((row) => ({
        firstName: row[headerIndex.firstName] ?? '',
        lastName: row[headerIndex.lastName] ?? '',
        yearOfBirth: Number(row[headerIndex.yearOfBirth] ?? ''),
        club: row[headerIndex.club] ?? undefined,
        position: (
          row[headerIndex.position] ?? ''
        ).toUpperCase() as CsvRow['position'],
        currentValue: Number(row[headerIndex.currentValue] ?? ''),
      }));

      const result = await importPlayersFromCsv(parsedRows);

      if (result.createdCount > 0) {
        toast.success(`Imported ${result.createdCount} player(s).`);
      }

      if (result.errorCount > 0) {
        const preview = result.errors
          .slice(0, 3)
          .map((error) => `Row ${error.row}: ${error.message}`)
          .join(' | ');
        toast.error(`Failed ${result.errorCount} row(s). ${preview}`);
      }

      if (result.createdCount === 0 && result.errorCount === 0) {
        toast.info('No rows to import.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to import CSV.');
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
          clubId, position, currentValue.
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
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </CardFooter>
    </Card>
  );
}
