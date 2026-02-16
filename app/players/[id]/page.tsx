import { notFound } from 'next/navigation';
import { getClubs } from '@/app/actions/clubs';
import { getPLayer } from '@/app/actions/players/player';
import { getPlayerHistories } from '@/app/actions/players/playerHistory';
import AppDrawer from '@/components/common/AppDrawer';
import AddTransferForm from './AddTransferForm';
import PlayerValueChart from './PlayerValueChart';
import { TransferHistory } from './transfer-history';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PlayerDetailPage({ params }: Props) {
  const { id } = await params;

  const player = await getPLayer(id);

  if (!player) {
    notFound();
  }

  const clubs = await getClubs();

  const playerHistory = await getPlayerHistories(id);

  const valueHistory = player.values.map(({ date, value }) => ({
    date: date.toISOString(),
    value,
  }));

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold">
          {player.firstName} {player.lastName.toUpperCase()}
        </h1>
        <AppDrawer labelBtn="Add transfer" title="Add transfer">
          <AddTransferForm clubs={clubs} />
        </AppDrawer>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TransferHistory data={playerHistory} />
        <PlayerValueChart data={valueHistory} type="linear" />
      </div>
    </section>
  );
}
