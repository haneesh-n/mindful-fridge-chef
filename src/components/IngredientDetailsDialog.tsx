import { Ingredient, getExpiryStatus, getExpiryColor } from "@/types/ingredient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, Tag, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

interface IngredientDetailsDialogProps {
  ingredient: Ingredient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (id: string) => void;
}

const IngredientDetailsDialog = ({
  ingredient,
  open,
  onOpenChange,
  onDelete,
}: IngredientDetailsDialogProps) => {
  if (!ingredient) return null;

  const expiryStatus = getExpiryStatus(ingredient.expiryDate);
  const statusColor = getExpiryColor(expiryStatus);
  const daysUntilExpiry = Math.ceil(
    (ingredient.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleDelete = () => {
    onDelete?.(ingredient.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-3xl font-bold mb-2">{ingredient.name}</DialogTitle>
              <Badge variant="outline" className="text-sm">
                {ingredient.category}
              </Badge>
            </div>
            <div className="p-3 rounded-xl bg-gradient-primary">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Quantity */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Quantity</p>
              <p className="text-lg font-semibold">{ingredient.quantity}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Purchase Date</p>
                <p className="text-sm font-semibold">
                  {format(ingredient.purchaseDate, "MMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Expiry Date</p>
                <p className="text-sm font-semibold">
                  {format(ingredient.expiryDate, "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Current Status</p>
            </div>
            <Badge className={`w-full justify-center text-base py-3 ${statusColor}`}>
              {expiryStatus === 'expired' && 'Expired - Discard Immediately'}
              {expiryStatus === 'expiring-soon' && `Expiring in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'} - Use Soon!`}
              {expiryStatus === 'fresh' && `Fresh - ${daysUntilExpiry} days remaining`}
            </Badge>
          </div>

          {/* Suggestions */}
          {expiryStatus === 'expiring-soon' && (
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm font-medium mb-2">💡 Quick Tip</p>
              <p className="text-sm text-muted-foreground">
                This ingredient is expiring soon! Check the Recipes page for suggestions on how to use it.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientDetailsDialog;
