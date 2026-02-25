import { notFound } from 'next/navigation';
import { getPLayer } from '@/app/actions/playerDetail/player';
import PlayerValueChart from './PlayerValueChart';

type Props = {
  id: string;
};

export default async function PlayerValueChartSection({ id }: Props) {
  const player = await getPLayer(id);

  if (!player) {
    notFound();
  }

  const valueHistory = player.values.map(({ date, value }) => ({
    date: date.toISOString(),
    value,
  }));

  return (
    <PlayerValueChart
      data={valueHistory}
      playerId={id}
      type="linear"
      actionDisabled={player.isRetired}
    />
  );
}
