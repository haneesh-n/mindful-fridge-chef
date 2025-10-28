import { Recipe } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, ChefHat, Users, CheckCircle2, Sparkles, Package } from "lucide-react";
import { toast } from "sonner";

interface RecipeDetailsDialogProps {
  recipe: Recipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockInstructions = [
  "Prepare all ingredients and wash vegetables thoroughly",
  "Heat oil in a large pan over medium heat",
  "Add main ingredients and cook until tender",
  "Season with salt, pepper, and your favorite spices",
  "Cook for 15-20 minutes, stirring occasionally",
  "Serve hot and enjoy your meal!",
];

const RecipeDetailsDialog = ({ recipe, open, onOpenChange }: RecipeDetailsDialogProps) => {
  if (!recipe) return null;

  const handleMarkAsUsed = () => {
    toast.success("Recipe marked as used!", {
      description: "Your ingredient inventory has been updated",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-bold leading-tight">
                {recipe.title}
              </DialogTitle>
              <p className="text-muted-foreground">{recipe.description}</p>
            </div>
            <ChefHat className="h-8 w-8 text-primary shrink-0" />
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Recipe Image */}
          <div className="h-64 rounded-xl bg-gradient-primary overflow-hidden" />

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Prep Time</p>
                <p className="text-sm font-semibold">{recipe.prepTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Servings</p>
                <p className="text-sm font-semibold">4 people</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Difficulty</p>
                <p className="text-sm font-semibold">{recipe.difficulty}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Ingredients */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Ingredients
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {recipe.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 border border-border"
                >
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span className="text-sm">{ingredient}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 p-4 rounded-lg bg-success/10 border border-success/20">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <p className="text-sm text-success-foreground">
                All ingredients available in your fridge!
              </p>
            </div>
          </div>

          <Separator />

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              Instructions
            </h3>
            <div className="space-y-3">
              {mockInstructions.map((instruction, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-foreground pt-1">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Nutrition Info */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h4 className="font-semibold mb-3">Nutritional Information (per serving)</h4>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">320</p>
                <p className="text-xs text-muted-foreground">Calories</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">12g</p>
                <p className="text-xs text-muted-foreground">Protein</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">8g</p>
                <p className="text-xs text-muted-foreground">Fat</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">45g</p>
                <p className="text-xs text-muted-foreground">Carbs</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              className="flex-1 bg-gradient-primary hover:opacity-90"
              onClick={handleMarkAsUsed}
            >
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Mark as Used
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetailsDialog;
