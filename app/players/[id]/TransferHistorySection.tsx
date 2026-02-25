import { notFound } from 'next/navigation';
import { getPLayer } from '@/app/actions/playerDetail/player';
import { getPlayerHistories } from '@/app/actions/playerDetail/playerHistory';
import TransferHistory from './TransferHistory';

type Props = {
  id: string;
};

export default async function TransferHistorySection({ id }: Props) {
  const [player, playerHistory] = await Promise.all([
    getPLayer(id),
    getPlayerHistories(id),
  ]);

  if (!player) {
    notFound();
  }

  return (
    <TransferHistory
      data={playerHistory}
      id={id}
      disabledBtn={player.isRetired}
    />
  );
}
