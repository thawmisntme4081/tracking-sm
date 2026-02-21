import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type TransferHistoryItem = {
  id: string;
  dateJoined: Date | null;
  buyValue: number | null;
  marketValue: number | null;
  onLoan: Date | null;
  club: {
    name: string;
  } | null;
};

type TransferHistoryProps = {
  data: TransferHistoryItem[];
};

function formatDate(date: Date | null) {
  if (!date) {
    return '-';
  }

  return date.toLocaleDateString('en-GB', { timeZone: 'UTC' });
}

function formatMoney(value: number | null) {
  if (value === null || value === undefined) {
    return '-';
  }

  return value.toLocaleString();
}

export function TransferHistory({ data }: TransferHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Player Transfer History</CardTitle>
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
                const previousHistory = data[index + 1];
                const leftClub = previousHistory?.club?.name ?? '-';
                const joinedClub = history.club?.name ?? '-';

                return (
                  <TableRow key={history.id}>
                    <TableCell>{formatDate(history.dateJoined)}</TableCell>
                    <TableCell>{leftClub}</TableCell>
                    <TableCell>{joinedClub}</TableCell>
                    <TableCell>{formatMoney(history.marketValue)}</TableCell>
                    <TableCell>{history.onLoan ? `On loan until ${formatDate(history.onLoan)}` : formatMoney(history.buyValue)}</TableCell>
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
