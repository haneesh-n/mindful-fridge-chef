import { useState } from "react";
import Navigation from "@/components/Navigation";
import IngredientCard from "@/components/IngredientCard";
import AddIngredientDialog from "@/components/AddIngredientDialog";
import IngredientDetailsDialog from "@/components/IngredientDetailsDialog";
import { Input } from "@/components/ui/input";
import { mockIngredients } from "@/data/mockData";
import { Ingredient } from "@/types/ingredient";
import { Search } from "lucide-react";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState(mockIngredients);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddIngredient = (newIngredient: Ingredient) => {
    setIngredients([...ingredients, newIngredient]);
  };

  const handleDeleteIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const handleIngredientClick = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setDialogOpen(true);
  };

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
          <AddIngredientDialog onAdd={handleAddIngredient} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIngredients.map((ingredient) => (
            <IngredientCard 
              key={ingredient.id} 
              ingredient={ingredient}
              onClick={() => handleIngredientClick(ingredient)}
            />
          ))}
        </div>

        {filteredIngredients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No ingredients found</p>
          </div>
        )}
      </main>

      <IngredientDetailsDialog
        ingredient={selectedIngredient}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onDelete={handleDeleteIngredient}
      />
    </div>
  );
};

export default Ingredients;
