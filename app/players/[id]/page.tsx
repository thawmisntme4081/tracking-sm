import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { PlayerValueChart } from './player-value-chart';
import { TransferHistory } from './transfer-history';

type PlayerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlayerDetailPage({
  params,
}: PlayerDetailPageProps) {
  const { id } = await params;

  const player = await prisma.player.findUnique({
    where: { id },
    select: {
      firstName: true,
      lastName: true,
      values: {
        orderBy: { date: 'asc' },
        select: {
          date: true,
          value: true,
        },
      },
    },
  });

  if (!player) {
    notFound();
  }

  const playerHistory = await prisma.playerHistory.findMany({
    where: { playerId: id },
    orderBy: { dateJoined: 'desc' },
    select: {
      id: true,
      dateJoined: true,
      buyValue: true,
      marketValue: true,
      club: {
        select: {
          name: true,
        },
      },
    },
  });

  const valueHistory = player.values.map(({ date, value }) => ({
    date: date.toISOString(),
    value,
  }));

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">
        {player.firstName} {player.lastName.toUpperCase()}
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <TransferHistory data={playerHistory} />
        <PlayerValueChart data={valueHistory} type="linear" />
      </div>
    </section>
  );
}
