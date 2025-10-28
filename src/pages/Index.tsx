import { useState } from "react";
import Navigation from "@/components/Navigation";
import IngredientCard from "@/components/IngredientCard";
import RecipeCard from "@/components/RecipeCard";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { mockIngredients, mockRecipes } from "@/data/mockData";
import { getExpiryStatus } from "@/types/ingredient";
import { Package, ChefHat, TrendingDown, Plus } from "lucide-react";
import heroImage from "@/assets/hero-kitchen.jpg";

const Index = () => {
  const [ingredients] = useState(mockIngredients);
  const [recipes] = useState(mockRecipes);

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
                <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Ingredient
                </Button>
                <Button size="lg" variant="outline">
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
          />
          <StatsCard
            title="Expiring Soon"
            value={expiringIngredients.length.toString()}
            description="Use within 2 days"
            icon={TrendingDown}
            trend={{ value: "2 less than yesterday", isPositive: true }}
          />
          <StatsCard
            title="Recipe Suggestions"
            value={recipes.length.toString()}
            description="Based on your inventory"
            icon={ChefHat}
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
              <IngredientCard key={ingredient.id} ingredient={ingredient} />
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
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
