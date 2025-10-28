import { useState } from "react";
import Navigation from "@/components/Navigation";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockRecipes } from "@/data/mockData";
import { Sparkles, Search } from "lucide-react";

const Recipes = () => {
  const [recipes] = useState(mockRecipes);
  const [searchQuery, setSearchQuery] = useState("");

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
          <Button className="bg-gradient-primary hover:opacity-90">
            <Sparkles className="mr-2 h-5 w-5" />
            Generate New Recipes
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No recipes found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Recipes;
