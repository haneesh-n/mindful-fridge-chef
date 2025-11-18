import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import IngredientCard from "@/components/IngredientCard";
import AddIngredientDialog from "@/components/AddIngredientDialog";
import IngredientDetailsDialog from "@/components/IngredientDetailsDialog";
import { Input } from "@/components/ui/input";
import { Ingredient } from "@/types/ingredient";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Ingredients = () => {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading ingredients...</p>
          </div>
        ) : filteredIngredients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "No ingredients found" : "No ingredients yet. Add your first ingredient!"}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredIngredients.map((ingredient) => (
              <IngredientCard 
                key={ingredient.id} 
                ingredient={ingredient}
                onClick={() => handleIngredientClick(ingredient)}
              />
            ))}
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
