'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type ChangeEvent, useRef, useState } from 'react';
import { toast } from 'sonner';
import { uploadPlayerValuesFromCsv } from '@/app/actions/players';
import { parseCsv } from '@/components/AddPlayer/csv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey?: string;
  filterPlaceholder?: string;
  totalPages: number;
  page: number;
  getRowHref?: (row: TData) => string;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  filterPlaceholder = 'Filter...',
  totalPages,
  page,
  getRowHref,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  const setPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {filterKey ? (
          <Input
            placeholder={filterPlaceholder}
            value={
              (table.getColumn(filterKey)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(filterKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        ) : (
          <Input
            placeholder={filterPlaceholder}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        )}
        <Button asChild>
          <Link href="/add-player">Add player</Link>
        </Button>
        <UpdatePlayerValue />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const original = row.original as { isRetired?: boolean };
                const isRetired = Boolean(original.isRetired);
                const className = [
                  getRowHref ? 'cursor-pointer' : '',
                  isRetired ? 'bg-red-200' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <TableRow
                    key={row.id}
                    className={className || undefined}
                    onClick={() => {
                      if (getRowHref) {
                        router.push(getRowHref(row.original));
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end gap-2">
        <div className="text-muted-foreground text-sm">
          Page {page} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

const requiredColumns = ['playerId', 'date', 'value'] as const;

function UpdatePlayerValue() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
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
      ) as Record<string, number>;

      const parsedRows = rows.map((row) => ({
        playerId: row[headerIndex.playerId] ?? '',
        date: row[headerIndex.date] ?? '',
        value: Number(row[headerIndex.value] ?? ''),
      }));

      const result = await uploadPlayerValuesFromCsv(parsedRows);

      if (result.createdCount > 0) {
        toast.success(`Uploaded ${result.createdCount} value row(s).`);
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

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload player values CSV.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload player value'}
      </Button>
    </>
  );
}
