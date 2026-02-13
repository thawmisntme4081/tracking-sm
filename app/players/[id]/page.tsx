import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
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
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold">
          {player.firstName} {player.lastName.toUpperCase()}
        </h1>
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button>Add transfer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add transfer</DrawerTitle>
              <DrawerDescription>
                Transfer form will be added here.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TransferHistory data={playerHistory} />
        <PlayerValueChart data={valueHistory} type="linear" />
      </div>
    </section>
  );
}
