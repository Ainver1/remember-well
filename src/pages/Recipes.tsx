import TextMemory from "@/components/memories/TextMemory";
import RecipeList from "@/components/recipes/RecipeList";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";

const RECIPE_SUGGESTIONS = [
  "Grandma's Apple Pie",
  "Holiday cookies",
  "Family stew",
  "Birthday cake",
  "Comfort soup",
  "Sunday pasta sauce",
  "Mom's pancakes",
  "Secret BBQ sauce",
  "Traditional bread",
  "Homemade pizza",
];

const Recipes = () => {
  const [searchParams] = useSearchParams();
  const presetTitle = searchParams.get('title') || undefined;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Family Recipes</h1>
          <p className="text-muted-foreground">Save your favorite family recipes</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TextMemory presetTitle={presetTitle} presetCategory="Recipes" />
          
          <Card>
            <CardContent className="p-4">
              <div className="font-medium mb-3">Recipe ideas</div>
              <div className="grid gap-2">
                {RECIPE_SUGGESTIONS.map((recipe, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const event = new CustomEvent('setPresetTitle', { detail: recipe });
                      window.dispatchEvent(event);
                    }}
                    className="text-left rounded-md border px-3 py-2 hover:bg-accent/40 transition text-sm"
                  >
                    {recipe}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <RecipeList />
        </div>
      </div>
    </div>
  );
};

export default Recipes;