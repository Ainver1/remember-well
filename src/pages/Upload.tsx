import UploadMemory from "@/components/memories/UploadMemory";
import { Category } from "@/data/db";
import { useSearchParams } from "react-router-dom";

const Upload = () => {
  const [searchParams] = useSearchParams();
  const presetTitle = searchParams.get('title') || undefined;
  const presetCategory = (searchParams.get('category') as Category) || undefined;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Upload Memory</h1>
          <p className="text-muted-foreground">Upload photos, videos, or audio files</p>
        </div>
        
        <UploadMemory presetTitle={presetTitle} presetCategory={presetCategory} />
      </div>
    </div>
  );
};

export default Upload;