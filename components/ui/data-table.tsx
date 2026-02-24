'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  getRowHref?: (row: TData) => string;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  filterPlaceholder = 'Filter...',
  getRowHref,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>(() => {
    const page = Number(searchParams.get('page') ?? '1');
    const pageNumber = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;

    return {
      pageIndex: pageNumber - 1,
      pageSize: 10,
    };
  });

  useEffect(() => {
    const page = Number(searchParams.get('page') ?? '1');
    const pageNumber = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const nextPageIndex = pageNumber - 1;

    setPagination((prev) =>
      prev.pageIndex === nextPageIndex
        ? prev
        : {
            ...prev,
            pageIndex: nextPageIndex,
          },
    );
  }, [searchParams]);

  const setPageQuery = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (pageNumber <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(pageNumber));
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
  });

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
        {/* Todo: open modal and update player value */}
        <Button>Update player value</Button>
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
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const nextPageIndex = Math.max(0, pagination.pageIndex - 1);
            table.setPageIndex(nextPageIndex);
            setPageQuery(nextPageIndex + 1);
          }}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const nextPageIndex = Math.min(
              table.getPageCount() - 1,
              pagination.pageIndex + 1,
            );
            table.setPageIndex(nextPageIndex);
            setPageQuery(nextPageIndex + 1);
          }}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
