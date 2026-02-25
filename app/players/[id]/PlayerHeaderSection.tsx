import { notFound } from 'next/navigation';
import { getPLayer } from '@/app/actions/playerDetail/player';

type Props = {
  id: string;
};

export default async function PlayerHeaderSection({ id }: Props) {
  const player = await getPLayer(id);

  if (!player) {
    notFound();
  }

  return (
    <h1 className="text-2xl font-semibold">
      {player.firstName} {player.lastName.toUpperCase()}
    </h1>
  );
}
