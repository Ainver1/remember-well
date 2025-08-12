import Spotlight from "@/components/common/Spotlight";
import MemoryRecorder from "@/components/memories/MemoryRecorder";
import UploadMemory from "@/components/memories/UploadMemory";
import MemoryList from "@/components/memories/MemoryList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/data/db";
import { useState } from "react";

const SUGGESTIONS: { title: string; category: Category }[] = [
  { title: "First day of school", category: "School" },
  { title: "A teacher who changed my life", category: "School" },
  { title: "My best friend growing up", category: "Friends" },
  { title: "A funny family tradition", category: "Funny Stories" },
  { title: "My earliest memory", category: "Early Childhood" },
  { title: "Advice I'd give my younger self", category: "Life Lessons" },
  { title: "A trip that shaped me", category: "Travel" },
  { title: "First job story", category: "Work" },
];

const Index = () => {
  const [tab, setTab] = useState("capture");
  const [preset, setPreset] = useState<{ title?: string; category?: Category }>({});

  const startFromSuggestion = (s: { title: string; category: Category }) => {
    setPreset({ title: s.title, category: s.category });
    setTab("capture");
  };

  return (
    <div className="min-h-screen bg-background">
      <header>
        <Spotlight>
          <div className="container mx-auto px-6 pt-16 pb-20 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-primary to-primary/70 bg-clip-text text-transparent">
              Life Memory Keeper
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Record stories, voices, and moments that matter—privately on your device, with an option to back up later.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button onClick={() => setTab("capture")}>Start recording</Button>
              <Button variant="secondary" onClick={() => setTab("upload")}>Upload a memory</Button>
            </div>
          </div>
        </Spotlight>
      </header>

      <main className="container mx-auto px-6 pb-20">
        <Tabs value={tab} onValueChange={setTab} className="mt-2">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
            <TabsTrigger value="capture">Capture</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="memories">Memories</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="capture" className="mt-6">
            <MemoryRecorder presetTitle={preset.title} presetCategory={preset.category} />
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <UploadMemory presetTitle={preset.title} presetCategory={preset.category} />
          </TabsContent>

          <TabsContent value="memories" className="mt-6">
            <MemoryList />

            <Card className="mt-6">
              <CardContent className="p-6 text-center">
                <div className="text-sm text-muted-foreground">
                  Optional cloud backup coming next. To enable secure backup, connect Supabase in the top-right (green button), then ask: "Enable Supabase backup".
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => startFromSuggestion(s)}
                  className="rounded-lg border p-4 text-left hover:bg-accent/40 transition focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label={`Start memory: ${s.title}`}
                >
                  <div className="font-medium">{s.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.category}</div>
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
