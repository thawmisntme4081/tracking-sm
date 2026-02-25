import { getPlayersForTable } from '@/app/actions/players';
import PlayersTable from '@/components/players/PlayersTable';

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function PlayersTableSection({ searchParams }: Props) {
  const { page } = await searchParams;
  const safePage = Math.max(1, Number(page ?? 1) || 1);
  const data = await getPlayersForTable(safePage);

  return <PlayersTable data={data} page={safePage} />;
}
