import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addMemory, CATEGORIES, Category, MemoryType } from "@/data/db";
import { toast } from "@/hooks/use-toast";

interface UploadMemoryProps {
  presetTitle?: string;
  presetCategory?: Category;
}

export default function UploadMemory({ presetTitle, presetCategory }: UploadMemoryProps) {
  const [title, setTitle] = useState(presetTitle || "Untitled upload");
  const [category, setCategory] = useState<Category>(presetCategory || "Other");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setTitle(presetTitle || "Untitled upload");
    if (presetCategory) setCategory(presetCategory);
  }, [presetTitle, presetCategory]);

  const onUpload = async () => {
    if (!file) return;
    const type: MemoryType = file.type.startsWith("audio")
      ? "audio"
      : file.type.startsWith("video")
      ? "video"
      : file.type.startsWith("image")
      ? "photo"
      : "text";

    const blob = new Blob([await file.arrayBuffer()], { type: file.type || "application/octet-stream" });

    await addMemory({
      title: title || file.name,
      category,
      type,
      createdAt: Date.now(),
      blob,
      fileName: file.name,
    });
    toast({ title: "Uploaded!", description: "Your memory is saved on this device." });
    setFile(null);
  };

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle>Upload a memory</CardTitle>
        <CardDescription>Attach audio, video, or photos already captured</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Grandparent interview" />
          </div>
          <div className="space-y-3">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="file">File</Label>
          <Input id="file" type="file" accept="audio/*,video/*,image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>

        <div className="space-y-3">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add people, places, years, etc." />
        </div>

        <Button disabled={!file} onClick={onUpload}>
          Save upload
        </Button>
      </CardContent>
    </Card>
  );
}
