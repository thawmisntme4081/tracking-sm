import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { PlayerValueChart } from "./player-value-chart";

type PlayerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlayerDetailPage({
  params,
}: PlayerDetailPageProps) {
  const { id } = await params;

  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      histories: {
        orderBy: { dateJoined: "desc" },
        take: 1,
        include: { club: true },
      },
      values: {
        orderBy: { date: "asc" },
      },
    },
  });

  if (!player) {
    notFound();
  }

  const clubName = player.histories[0]?.club?.name ?? "—";
  const currentValue = player.values[player.values.length - 1]?.value ?? null;
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
        <Card>
          <CardHeader>
            <CardTitle>Player Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <p>Year of birth: {player.yearOfBirth}</p>
            <p>Position: {player.position}</p>
            <p>Current club: {clubName}</p>
            <p>
              Current value:{" "}
              {currentValue !== null ? currentValue.toLocaleString() : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Player Value History</CardTitle>
          </CardHeader>
          <CardContent>
            <PlayerValueChart data={valueHistory} type="linear" />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
