import MemoryRecorder from "@/components/memories/MemoryRecorder";
import { Category } from "@/data/db";
import { useSearchParams } from "react-router-dom";

const Record = () => {
  const [searchParams] = useSearchParams();
  const presetTitle = searchParams.get('title') || undefined;
  const presetCategory = (searchParams.get('category') as Category) || undefined;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Record Memory</h1>
          <p className="text-muted-foreground">Capture audio or video memories</p>
        </div>
        
        <MemoryRecorder presetTitle={presetTitle} presetCategory={presetCategory} />
      </div>
    </div>
  );
};

export default Record;