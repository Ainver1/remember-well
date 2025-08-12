import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addMemory, CATEGORIES, Category } from "@/data/db";
import { toast } from "@/hooks/use-toast";

interface MemoryRecorderProps {
  presetTitle?: string;
  presetCategory?: Category;
}

export default function MemoryRecorder({ presetTitle, presetCategory }: MemoryRecorderProps) {
  const [recordingType, setRecordingType] = useState<"audio" | "video">("audio");
  const [isRecording, setIsRecording] = useState(false);
  const [title, setTitle] = useState(presetTitle || "Untitled memory");
  const [category, setCategory] = useState<Category>(presetCategory || "Other");
  const [notes, setNotes] = useState("");
  const [elapsed, setElapsed] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setTitle(presetTitle || "Untitled memory");
    if (presetCategory) setCategory(presetCategory);
  }, [presetTitle, presetCategory]);

  useEffect(() => {
    return () => {
      stopTracks();
    };
  }, []);

  const startTimer = () => {
    const start = Date.now();
    timerRef.current = window.setInterval(() => setElapsed(Date.now() - start), 200);
  };

  const stopTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setElapsed(0);
  };

  const stopTracks = () => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
  };

  const startRecording = async () => {
    try {
      const constraints: MediaStreamConstraints =
        recordingType === "audio" ? { audio: true } : { audio: true, video: { facingMode: "user" } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      const mimeType = recordingType === "audio" ? "audio/webm" : "video/webm";
      const mr = new MediaRecorder(stream, { mimeType });

      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        await addMemory({
          title: title || "Untitled memory",
          category,
          type: recordingType,
          createdAt: Date.now(),
          blob,
          durationMs: elapsed,
        });
        toast({ title: "Saved!", description: "Your memory was saved on this device." });
        setIsRecording(false);
        stopTracks();
        stopTimer();
      };

      mediaRecorderRef.current = mr;
      mr.start();
      setIsRecording(true);
      startTimer();

      if (recordingType === "video" && videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Permission needed", description: "Please allow microphone/camera access." });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const seconds = Math.round(elapsed / 1000);

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle>Record a memory</CardTitle>
        <CardDescription>Capture audio or video on your device</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. First day of school" />
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
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add context you want future generations to know..." />
        </div>

        <div className="flex items-center gap-3">
          <Button variant={recordingType === "audio" ? "default" : "secondary"} onClick={() => setRecordingType("audio")}>Audio</Button>
          <Button variant={recordingType === "video" ? "default" : "secondary"} onClick={() => setRecordingType("video")}>Video</Button>
          <div className="ml-auto text-sm text-muted-foreground">{isRecording ? `Recording… ${seconds}s` : "Idle"}</div>
        </div>

        {recordingType === "video" && (
          <div className="rounded-lg overflow-hidden border bg-muted/20 aspect-video">
            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
          </div>
        )}

        <div className="flex gap-3">
          {!isRecording ? (
            <Button onClick={startRecording}>Start recording</Button>
          ) : (
            <Button variant="destructive" onClick={stopRecording}>
              Stop & save
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
