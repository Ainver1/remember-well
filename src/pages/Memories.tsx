import MemoryList from "@/components/memories/MemoryList";
import { Card, CardContent } from "@/components/ui/card";

const Memories = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Memories</h1>
          <p className="text-muted-foreground">View and manage your saved memories</p>
        </div>

        <MemoryList />

        <Card className="mt-6">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-muted-foreground">
              Optional cloud backup coming next. To enable secure backup, connect Supabase in the top-right (green button), then ask: "Enable Supabase backup".
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Memories;