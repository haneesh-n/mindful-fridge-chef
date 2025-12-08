import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetailsDialog from "@/components/RecipeDetailsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Recipe } from "@/data/mockData";
import { Sparkles, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Recipes = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchRecipes = useCallback(async (retryCount = 0) => {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // Retry on schema cache errors
      if (error.code === "PGRST002" && retryCount < 3) {
        setTimeout(() => fetchRecipes(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      console.error("Error fetching recipes:", error);
      toast.error("Failed to load recipes. Please refresh the page.");
      setIsLoading(false);
    } else {
      const formattedRecipes: Recipe[] = (data || []).map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description || "",
        ingredients: recipe.ingredients || [],
        prepTime: recipe.prep_time,
        difficulty: recipe.difficulty,
        image: recipe.image,
      }));
      setRecipes(formattedRecipes);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchRecipes();
    }
  }, [user, fetchRecipes]);

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setDialogOpen(true);
  };

  const handleGenerateRecipes = async () => {
    setIsGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to generate recipes");
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-recipes', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success(`Generated ${data.recipes.length} new recipes!`);
      await fetchRecipes();
    } catch (error) {
      console.error("Error generating recipes:", error);
      toast.error("Failed to generate recipes. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Recipe Suggestions</h1>
          <p className="text-muted-foreground">
            AI-powered recipes based on your expiring ingredients
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            className="bg-gradient-primary hover:opacity-90" 
            onClick={handleGenerateRecipes}
            disabled={isGenerating}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {isGenerating ? "Generating..." : "Generate New Recipes"}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Loading recipes...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe}
                  onClick={() => handleRecipeClick(recipe)}
                />
              ))}
            </div>

            {filteredRecipes.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {recipes.length === 0 
                    ? "No recipes yet. Generate some recipes based on your ingredients!" 
                    : "No recipes found"}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <RecipeDetailsDialog
        recipe={selectedRecipe}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Recipes;