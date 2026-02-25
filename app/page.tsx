import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import PlayersTableSection from '../components/PlayersTableSection';

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function Home({ searchParams }: Props) {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">SM Players</h1>
      <Suspense fallback={<PlayersTableSkeleton />}>
        <PlayersTableSection searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

function PlayersTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-full max-w-sm" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-36" />
      </div>

      <div className="rounded-md border">
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-6 gap-3">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>

          {Array.from({ length: 8 }, (_, index) => (
            <div key={String(index)} className="grid grid-cols-6 gap-3">
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}
