import Spotlight from "@/components/common/Spotlight";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/data/db";
import { useNavigate } from "react-router-dom";

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

const RECIPE_SUGGESTIONS = [
  "Grandma's Apple Pie",
  "Holiday cookies", 
  "Family stew",
  "Birthday cake",
  "Comfort soup",
  "Sunday pasta sauce",
];

const Home = () => {
  const navigate = useNavigate();

  const startFromSuggestion = (s: { title: string; category: Category }) => {
    const params = new URLSearchParams({ title: s.title, category: s.category });
    navigate(`/record?${params}`);
  };

  const startRecipe = (title: string) => {
    const params = new URLSearchParams({ title, category: "Recipes" });
    navigate(`/recipes?${params}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header>
        <Spotlight>
          <div className="container mx-auto px-4 pt-8 pb-12 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-primary to-primary/70 bg-clip-text text-transparent">
              Life Memory Keeper
            </h1>
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              Record stories, voices, and moments that matter—privately on your device.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Button onClick={() => navigate('/record')} className="w-full sm:w-auto">
                Start recording
              </Button>
              <Button variant="secondary" onClick={() => navigate('/upload')} className="w-full sm:w-auto">
                Upload memory
              </Button>
            </div>
          </div>
        </Spotlight>
      </header>

      <main className="container mx-auto px-4">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-3">Memory suggestions</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {SUGGESTIONS.slice(0, 6).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => startFromSuggestion(s)}
                    className="rounded-lg border p-3 text-left hover:bg-accent/40 transition text-sm"
                  >
                    <div className="font-medium">{s.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.category}</div>
                  </button>
                ))}
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/suggestions')} 
                className="w-full mt-3"
                size="sm"
              >
                See all suggestions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-3">Recipe ideas</h2>
              <div className="grid gap-2 grid-cols-2">
                {RECIPE_SUGGESTIONS.slice(0, 4).map((recipe, i) => (
                  <button
                    key={i}
                    onClick={() => startRecipe(recipe)}
                    className="text-left rounded-md border px-3 py-2 hover:bg-accent/40 transition text-sm"
                  >
                    {recipe}
                  </button>
                ))}
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/recipes')} 
                className="w-full mt-3"
                size="sm"
              >
                See all recipes
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;