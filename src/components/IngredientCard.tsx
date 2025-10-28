import { Ingredient, getExpiryStatus, getExpiryColor } from "@/types/ingredient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package } from "lucide-react";
import { format } from "date-fns";

interface IngredientCardProps {
  ingredient: Ingredient;
  onClick?: () => void;
}

const IngredientCard = ({ ingredient, onClick }: IngredientCardProps) => {
  const expiryStatus = getExpiryStatus(ingredient.expiryDate);
  const statusColor = getExpiryColor(expiryStatus);
  const daysUntilExpiry = Math.ceil(
    (ingredient.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-hover cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{ingredient.name}</h3>
              <p className="text-sm text-muted-foreground">{ingredient.quantity}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {ingredient.category}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Expires: {format(ingredient.expiryDate, "MMM d, yyyy")}</span>
          </div>
          
          <Badge className={`w-full justify-center ${statusColor}`}>
            {expiryStatus === 'expired' && 'Expired'}
            {expiryStatus === 'expiring-soon' && `Expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}`}
            {expiryStatus === 'fresh' && `Fresh (${daysUntilExpiry} days left)`}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default IngredientCard;
