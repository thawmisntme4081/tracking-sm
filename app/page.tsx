import { getPlayersForTable } from "@/app/actions/players";
import PlayersTable, {
  type PlayerRow,
} from "@/components/players/PlayersTable";

export default async function Home() {
  const players = await getPlayersForTable();

  const data: PlayerRow[] = players.map((player) => ({
    id: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    yearOfBirth: player.yearOfBirth,
    position: player.position,
    club: player.histories[0]?.club?.name ?? null,
    currentValue: player.values[0]?.value ?? null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Players</h1>
      </div>
      <PlayersTable data={data} />
    </div>
  );
}
