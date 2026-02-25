import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import PlayerHeaderSection from './PlayerHeaderSection';
import PlayerValueChartSection from './PlayerValueChartSection';
import TransferHistorySection from './TransferHistorySection';

type Props = {
  params: Promise<{ id: string }>;
};

export default function PlayerDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<PlayerDetailSkeleton />}>
      <PlayerDetailContent params={params} />
    </Suspense>
  );
}

async function PlayerDetailContent({ params }: Props) {
  const { id } = await params;

  return (
    <section className="space-y-6">
      <Suspense fallback={<HeaderSkeleton />}>
        <PlayerHeaderSection id={id} />
      </Suspense>

      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<TransferHistoryCardSkeleton />}>
          <TransferHistorySection id={id} />
        </Suspense>
        <Suspense fallback={<PlayerValueChartCardSkeleton />}>
          <PlayerValueChartSection id={id} />
        </Suspense>
      </div>
    </section>
  );
}

function PlayerDetailSkeleton() {
  return (
    <section className="space-y-6">
      <HeaderSkeleton />
      <div className="grid grid-cols-2 gap-4">
        <TransferHistoryCardSkeleton />
        <PlayerValueChartCardSkeleton />
      </div>
    </section>
  );
}

function HeaderSkeleton() {
  return <Skeleton className="h-8 w-80" />;
}

function TransferHistoryCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-9 w-9" />
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-5 gap-3">
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>

        {Array.from({ length: 6 }, (_, index) => (
          <div key={String(index)} className="grid grid-cols-5 gap-3">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PlayerValueChartCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-9 w-32" />
      </div>
      <Skeleton className="h-70 w-full rounded-lg" />
    </div>
  );
}
