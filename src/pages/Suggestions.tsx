import { Category } from "@/data/db";
import { useNavigate } from "react-router-dom";

const SUGGESTIONS: { title: string; category: Category }[] = [
  { title: "First day of school", category: "School" },
  { title: "A teacher who changed my life", category: "School" },
  { title: "Learning to drive", category: "School" },
  { title: "Graduation day", category: "School" },
  { title: "My best friend growing up", category: "Friends" },
  { title: "A sleepover adventure", category: "Friends" },
  { title: "Making up after a fight", category: "Friends" },
  { title: "A funny family tradition", category: "Funny Stories" },
  { title: "The time we got lost", category: "Funny Stories" },
  { title: "A prank gone wrong", category: "Funny Stories" },
  { title: "My earliest memory", category: "Early Childhood" },
  { title: "Learning to walk/talk", category: "Early Childhood" },
  { title: "First pet", category: "Early Childhood" },
  { title: "Advice I'd give my younger self", category: "Life Lessons" },
  { title: "A mistake that taught me", category: "Life Lessons" },
  { title: "When I learned about kindness", category: "Life Lessons" },
  { title: "A trip that shaped me", category: "Travel" },
  { title: "Getting lost in a new city", category: "Travel" },
  { title: "Best vacation memory", category: "Travel" },
  { title: "First job story", category: "Work" },
  { title: "A difficult decision", category: "Work" },
  { title: "Proud work moment", category: "Work" },
];

const Suggestions = () => {
  const navigate = useNavigate();

  const startFromSuggestion = (s: { title: string; category: Category }) => {
    const params = new URLSearchParams({ title: s.title, category: s.category });
    navigate(`/record?${params}`);
  };

  const categories = Array.from(new Set(SUGGESTIONS.map(s => s.category)));

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Memory Suggestions</h1>
          <p className="text-muted-foreground">Ideas to help capture important memories</p>
        </div>

        <div className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h2 className="font-semibold text-lg mb-3 text-primary">{category}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {SUGGESTIONS.filter(s => s.category === category).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => startFromSuggestion(s)}
                    className="rounded-lg border p-4 text-left hover:bg-accent/40 transition"
                  >
                    <div className="font-medium">{s.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.category}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Suggestions;