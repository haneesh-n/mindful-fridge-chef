import { Recipe } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ChefHat } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-hover group">
      <div className="h-48 bg-gradient-primary" />
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {recipe.title}
          </CardTitle>
          <ChefHat className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{recipe.description}</p>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {recipe.prepTime}
          </div>
          <Badge variant="secondary">{recipe.difficulty}</Badge>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Ingredients:</p>
          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.map((ingredient, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button className="w-full bg-gradient-primary hover:opacity-90">
          View Recipe
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
