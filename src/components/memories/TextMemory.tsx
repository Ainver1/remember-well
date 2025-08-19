import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addMemory, Category } from "@/data/db";
import { toast } from "@/hooks/use-toast";

interface TextMemoryProps {
  presetTitle?: string;
  presetCategory?: Category;
}

export default function TextMemory({ presetTitle, presetCategory }: TextMemoryProps) {
  const [title, setTitle] = useState(presetTitle || "New recipe");
  const [category, setCategory] = useState<Category>(presetCategory || "Recipes");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (presetTitle) setTitle(presetTitle);
    if (presetCategory) setCategory(presetCategory);
  }, [presetTitle, presetCategory]);

  useEffect(() => {
    const handlePresetTitle = (event: CustomEvent) => {
      setTitle(event.detail);
    };
    
    window.addEventListener('setPresetTitle', handlePresetTitle as EventListener);
    return () => window.removeEventListener('setPresetTitle', handlePresetTitle as EventListener);
  }, []);

  const save = async () => {
    if (!title.trim() && !content.trim()) return;
    await addMemory({
      title: title || "Untitled",
      category,
      type: "text",
      createdAt: Date.now(),
      notes: content,
    });
    toast({ title: "Saved!", description: "Your recipe was saved on this device." });
    setTitle("New recipe");
    setContent("");
  };

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle>Add a text recipe</CardTitle>
        <CardDescription>Ingredients, steps, memories behind the dish</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Grandma's Apple Pie" />
        </div>
        <div className="space-y-3">
          <Label htmlFor="content">Recipe details</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ingredients\n- 2 apples\n- 1 cup flour\n\nSteps\n1. Preheat oven...\n2. Mix..."
            className="min-h-[180px]"
          />
        </div>
        <Button onClick={save}>Save recipe</Button>
      </CardContent>
    </Card>
  );
}
