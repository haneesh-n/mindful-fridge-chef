import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { CalendarIcon, Plus, Scan } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddIngredientDialogProps {
  trigger?: React.ReactNode;
  onAdd?: (ingredient: any) => void;
}

const categories = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Meat",
  "Grains",
  "Beverages",
  "Snacks",
  "Other",
];

const AddIngredientDialog = ({ trigger, onAdd }: AddIngredientDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    category: "",
    purchaseDate: new Date(),
    expiryDate: undefined as Date | undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.quantity || !formData.category || !formData.expiryDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newIngredient = {
      id: Date.now().toString(),
      name: formData.name,
      quantity: formData.quantity,
      category: formData.category,
      purchaseDate: formData.purchaseDate,
      expiryDate: formData.expiryDate,
    };

    onAdd?.(newIngredient);
    
    toast.success(`${formData.name} added successfully!`, {
      description: `Expires on ${format(formData.expiryDate, "MMM d, yyyy")}`,
    });

    // Reset form
    setFormData({
      name: "",
      quantity: "",
      category: "",
      purchaseDate: new Date(),
      expiryDate: undefined,
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-primary hover:opacity-90">
            <Plus className="mr-2 h-5 w-5" />
            Add Ingredient
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Ingredient</DialogTitle>
          <DialogDescription>
            Track your ingredients and get notified before they expire
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ingredient Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Milk, Tomatoes, Chicken"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                placeholder="e.g., 1L, 500g"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Purchase Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal",
                      !formData.purchaseDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.purchaseDate ? format(formData.purchaseDate, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.purchaseDate}
                    onSelect={(date) => date && setFormData({ ...formData, purchaseDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Expiry Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal",
                      !formData.expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? format(formData.expiryDate, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={(date) => setFormData({ ...formData, expiryDate: date })}
                    initialFocus
                    disabled={(date) => date < formData.purchaseDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="p-2 rounded-lg bg-primary/10">
              <Scan className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Quick Scan</p>
              <p className="text-xs text-muted-foreground">Scan barcode to auto-fill details</p>
            </div>
            <Button type="button" variant="outline" size="sm" disabled>
              Coming Soon
            </Button>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              Add Ingredient
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddIngredientDialog;
