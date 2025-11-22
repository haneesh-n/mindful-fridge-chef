import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import IngredientCard from "@/components/IngredientCard";
import RecipeCard from "@/components/RecipeCard";
import StatsCard from "@/components/StatsCard";
import AddIngredientDialog from "@/components/AddIngredientDialog";
import IngredientDetailsDialog from "@/components/IngredientDetailsDialog";
import RecipeDetailsDialog from "@/components/RecipeDetailsDialog";
import { Button } from "@/components/ui/button";
import { mockRecipes, Recipe } from "@/data/mockData";
import { getExpiryStatus, Ingredient } from "@/types/ingredient";
import { Package, ChefHat, TrendingDown } from "lucide-react";
import heroImage from "@/assets/hero-kitchen.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipes] = useState(mockRecipes);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [ingredientDialogOpen, setIngredientDialogOpen] = useState(false);
  const [recipeDialogOpen, setRecipeDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchIngredients();
    }
  }, [user]);

  const fetchIngredients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ingredients")
      .select("*")
      .order("expiry_date", { ascending: true });

    if (error) {
      toast.error("Failed to load ingredients");
      console.error(error);
    } else {
      setIngredients(data.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        category: item.category,
        purchaseDate: new Date(item.purchase_date),
        expiryDate: new Date(item.expiry_date),
        image: item.image || undefined,
      })));
    }
    setLoading(false);
  };

  const handleAddIngredient = async (newIngredient: Omit<Ingredient, "id">) => {
    const { error } = await supabase
      .from("ingredients")
      .insert({
        name: newIngredient.name,
        quantity: newIngredient.quantity,
        category: newIngredient.category,
        purchase_date: newIngredient.purchaseDate.toISOString(),
        expiry_date: newIngredient.expiryDate.toISOString(),
        image: newIngredient.image,
        user_id: user?.id,
      });

    if (error) {
      toast.error("Failed to add ingredient");
      console.error(error);
    } else {
      fetchIngredients();
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    const { error } = await supabase
      .from("ingredients")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete ingredient");
      console.error(error);
    } else {
      fetchIngredients();
      toast.success("Ingredient deleted successfully");
    }
  };

  const handleIngredientClick = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIngredientDialogOpen(true);
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setRecipeDialogOpen(true);
  };

  const expiringIngredients = ingredients.filter(
    (ing) => getExpiryStatus(ing.expiryDate) === 'expiring-soon'
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight">
                Minimize Waste,<br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Maximize Flavor
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Your AI-powered kitchen companion that helps you track ingredients, 
                monitor expiry dates, and discover delicious recipes.
              </p>
              <div className="flex gap-4">
                <AddIngredientDialog onAdd={handleAddIngredient} />
                <Button size="lg" variant="outline" onClick={() => navigate('/recipes')}>
                  Browse Recipes
                </Button>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-hover">
              <img 
                src={heroImage} 
                alt="Fresh ingredients in a modern kitchen" 
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Ingredients"
            value={ingredients.length.toString()}
            description="Currently in your fridge"
            icon={Package}
            onClick={() => navigate('/ingredients')}
          />
          <StatsCard
            title="Expiring Soon"
            value={expiringIngredients.length.toString()}
            description="Use within 2 days"
            icon={TrendingDown}
            trend={{ value: "2 less than yesterday", isPositive: true }}
            onClick={() => navigate('/ingredients')}
          />
          <StatsCard
            title="Recipe Suggestions"
            value={recipes.length.toString()}
            description="Based on your inventory"
            icon={ChefHat}
            onClick={() => navigate('/recipes')}
          />
        </div>
      </section>

      {/* Expiring Ingredients */}
      {expiringIngredients.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Expiring Soon</h2>
              <p className="text-muted-foreground">Use these ingredients before they go bad</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {expiringIngredients.map((ingredient) => (
              <IngredientCard 
                key={ingredient.id} 
                ingredient={ingredient} 
                onClick={() => handleIngredientClick(ingredient)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Suggested Recipes */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Suggested Recipes</h2>
            <p className="text-muted-foreground">Perfect for your expiring ingredients</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/recipes')}>View All</Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onClick={() => handleRecipeClick(recipe)}
            />
          ))}
        </div>
      </section>

      {/* Dialogs */}
      <IngredientDetailsDialog
        ingredient={selectedIngredient}
        open={ingredientDialogOpen}
        onOpenChange={setIngredientDialogOpen}
        onDelete={handleDeleteIngredient}
      />
      <RecipeDetailsDialog
        recipe={selectedRecipe}
        open={recipeDialogOpen}
        onOpenChange={setRecipeDialogOpen}
      />
    </div>
  );
};

export default Index;
