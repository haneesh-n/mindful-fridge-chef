import { useState } from "react";
import Navigation from "@/components/Navigation";
import IngredientCard from "@/components/IngredientCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockIngredients } from "@/data/mockData";
import { Plus, Search } from "lucide-react";

const Ingredients = () => {
  const [ingredients] = useState(mockIngredients);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIngredients = ingredients.filter((ing) =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Ingredients</h1>
          <p className="text-muted-foreground">
            Track and manage all your fridge ingredients in one place
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Plus className="mr-2 h-5 w-5" />
            Add Ingredient
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIngredients.map((ingredient) => (
            <IngredientCard key={ingredient.id} ingredient={ingredient} />
          ))}
        </div>

        {filteredIngredients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No ingredients found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Ingredients;
