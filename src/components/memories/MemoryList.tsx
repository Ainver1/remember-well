import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteMemory, getAllMemories, Memory } from "@/data/db";
import { toast } from "@/hooks/use-toast";

const typeLabel = (m: Memory) => (m.type === "photo" ? "Photo" : m.type === "audio" ? "Audio" : m.type === "video" ? "Video" : "Note");

export default function MemoryList() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    const all = await getAllMemories();
    setMemories(all);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return memories;
    return memories.filter((m) => m.category === filter);
  }, [filter, memories]);

  const onDelete = async (id?: number) => {
    if (!id) return;
    await deleteMemory(id);
    toast({ title: "Deleted", description: "Memory removed from this device." });
    load();
  };

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle>Your memories</CardTitle>
        <CardDescription>Stored privately on this device</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">{filtered.length} shown</div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm">Filter</span>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {[...new Set(memories.map((m) => m.category))].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <div key={m.id} className="rounded-lg border p-3 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{m.category}</Badge>
                <div className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</div>
              </div>
              <div className="rounded-md overflow-hidden border bg-muted/20 mb-3">
                {m.type === "audio" && m.blob && (
                  <audio controls src={URL.createObjectURL(m.blob)} className="w-full" />
                )}
                {m.type === "video" && m.blob && (
                  <video controls src={URL.createObjectURL(m.blob)} className="w-full aspect-video" />
                )}
                {m.type === "photo" && m.blob && (
                  <img src={URL.createObjectURL(m.blob)} alt={`${m.title} photo memory`} className="w-full h-48 object-cover" loading="lazy" />
                )}
              </div>
              <div className="space-y-1">
                <div className="font-medium leading-tight">{m.title}</div>
                <div className="text-xs text-muted-foreground">{typeLabel(m)}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => onDelete(m.id)}>Delete</Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-10">No memories yet. Record or upload to get started.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
