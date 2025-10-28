import { Ingredient } from "@/types/ingredient";

export const mockIngredients: Ingredient[] = [
  {
    id: "1",
    name: "Milk",
    quantity: "1 Liter",
    category: "Dairy",
    purchaseDate: new Date(2025, 9, 26),
    expiryDate: new Date(2025, 9, 30),
  },
  {
    id: "2",
    name: "Tomatoes",
    quantity: "500g",
    category: "Vegetables",
    purchaseDate: new Date(2025, 9, 25),
    expiryDate: new Date(2025, 9, 31),
  },
  {
    id: "3",
    name: "Spinach",
    quantity: "200g",
    category: "Vegetables",
    purchaseDate: new Date(2025, 9, 27),
    expiryDate: new Date(2025, 9, 29),
  },
  {
    id: "4",
    name: "Chicken Breast",
    quantity: "800g",
    category: "Meat",
    purchaseDate: new Date(2025, 9, 27),
    expiryDate: new Date(2025, 10, 1),
  },
  {
    id: "5",
    name: "Yogurt",
    quantity: "400g",
    category: "Dairy",
    purchaseDate: new Date(2025, 9, 26),
    expiryDate: new Date(2025, 10, 2),
  },
  {
    id: "6",
    name: "Eggs",
    quantity: "12 pieces",
    category: "Dairy",
    purchaseDate: new Date(2025, 9, 24),
    expiryDate: new Date(2025, 10, 8),
  },
];

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  prepTime: string;
  difficulty: string;
  image?: string;
}

export const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Creamy Spinach Pasta",
    description: "A delicious and easy pasta dish using spinach and milk that's about to expire",
    ingredients: ["Spinach", "Milk", "Pasta", "Garlic", "Parmesan"],
    prepTime: "20 mins",
    difficulty: "Easy",
  },
  {
    id: "2",
    title: "Fresh Garden Salad",
    description: "Healthy salad perfect for using up tomatoes and other fresh vegetables",
    ingredients: ["Tomatoes", "Spinach", "Olive Oil", "Lemon", "Salt"],
    prepTime: "10 mins",
    difficulty: "Easy",
  },
  {
    id: "3",
    title: "Chicken Yogurt Curry",
    description: "Flavorful curry that makes great use of chicken and yogurt",
    ingredients: ["Chicken Breast", "Yogurt", "Tomatoes", "Spices", "Rice"],
    prepTime: "35 mins",
    difficulty: "Medium",
  },
];
