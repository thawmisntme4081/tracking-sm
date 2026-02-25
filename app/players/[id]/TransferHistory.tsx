import { getClubs } from '@/app/actions/clubs';
import AddTransferForm from '@/components/AddTransfer/AddTransferForm';
import AppDrawer from '@/components/common/AppDrawer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, formatMoney } from '@/lib/format';

type TransferHistoryItem = {
  id: string;
  type: 'TRANSFER' | 'LOAN' | null;
  marketValue: number | null;
  eventDate: Date | null;
  loanEndAt: Date | null;
  fee: number | null;
  loanParent: {
    name: string;
  } | null;
  fromClub: {
    name: string;
  } | null;
  toClub: {
    name: string;
  } | null;
};

type TransferHistoryProps = {
  data: TransferHistoryItem[];
  id: string;
  disabledBtn?: boolean;
};

function formatFeeOrLoan(history: TransferHistoryItem) {
  if (history.type === 'LOAN' || history.loanEndAt) {
    return `On loan until ${formatDate(history.loanEndAt)}`;
  }

  return formatMoney(history.fee);
}

export default async function TransferHistory({
  data,
  id,
  disabledBtn = false,
}: TransferHistoryProps) {
  const clubs = await getClubs();

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Player Transfer History</CardTitle>
        <AppDrawer labelBtn="+" title="Add transfer" disabled={disabledBtn}>
          <AddTransferForm playerId={id} clubs={clubs} />
        </AppDrawer>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {data.length === 0 ? (
          <p className="text-muted-foreground">No transfer history yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Left</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((history, index) => {
                const fromClub = history.fromClub?.name
                  ? history.fromClub.name
                  : history.toClub?.name && index !== data.length - 1
                    ? 'Without Club'
                    : '-';

                const toClub = history.toClub?.name
                  ? history.toClub.name
                  : history.fromClub?.name && index !== data.length - 1
                    ? 'Without Club'
                    : '-';

                return (
                  <TableRow key={history.id}>
                    <TableCell>{formatDate(history.eventDate)}</TableCell>
                    <TableCell>{fromClub}</TableCell>
                    <TableCell>{toClub}</TableCell>
                    <TableCell>{formatMoney(history.marketValue)}</TableCell>
                    <TableCell>{formatFeeOrLoan(history)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
