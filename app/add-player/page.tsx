import AddPlayerForm from "@/components/AddPlayer/AddPlayerForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <Tabs defaultValue="form" className="w-full">
        <TabsList>
          <TabsTrigger value="form">Player Form</TabsTrigger>
          <TabsTrigger value="csv">CSV Import</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <AddPlayerForm />
        </TabsContent>

        <TabsContent value="csv">
          <div className="grid gap-4 border bg-background p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">CSV Import</h2>
              <p className="text-sm text-muted-foreground">
                Upload a CSV file with columns: firstName, lastName,
                yearOfBirth, position, currentValue.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="csvFile">CSV File</Label>
              <Input id="csvFile" type="file" accept=".csv" />
            </div>
            <Button type="button">Upload</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
