import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllMemories, Memory } from "@/data/db";
import { toast } from "@/hooks/use-toast";

export default function RecipeList() {
  const [items, setItems] = useState<Memory[]>([]);

  const load = async () => {
    const all = await getAllMemories();
    setItems(all.filter((m) => m.category === "Recipes"));
  };

  useEffect(() => { load(); }, []);

  const excerpt = (t?: string) => (t ? (t.length > 140 ? t.slice(0, 140) + "…" : t) : "");

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle>Your recipes</CardTitle>
        <CardDescription>Saved privately on this device</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <div key={m.id} className="rounded-lg border p-4 bg-card/50">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{m.category}</Badge>
                <div className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleDateString()}</div>
              </div>
              {m.type === "photo" && m.blob && (
                <img src={URL.createObjectURL(m.blob)} alt={`${m.title} recipe photo`} className="w-full h-40 object-cover rounded-md border" loading="lazy" />
              )}
              {m.type === "video" && m.blob && (
                <video controls src={URL.createObjectURL(m.blob)} className="w-full aspect-video rounded-md border" />
              )}
              {m.type === "audio" && m.blob && (
                <audio controls src={URL.createObjectURL(m.blob)} className="w-full" />
              )}
              <div className="mt-3 font-medium">{m.title}</div>
              {m.notes && (
                <div className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{excerpt(m.notes)}</div>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-10">No recipes yet. Add one above!</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
