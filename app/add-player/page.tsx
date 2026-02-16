import { getClubs } from '@/app/actions/clubs';
import AddPlayerForm from '@/components/AddPlayer/AddPlayerForm';
import CsvImportForm from '@/components/AddPlayer/CsvImportForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function Page() {
  const clubs = await getClubs();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Tabs defaultValue="form" className="w-full">
        <TabsList>
          <TabsTrigger value="form">Player Form</TabsTrigger>
          <TabsTrigger value="csv">CSV Import</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <AddPlayerForm clubs={clubs} />
        </TabsContent>

        <TabsContent value="csv">
          <CsvImportForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
