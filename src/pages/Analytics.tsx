import Navigation from "@/components/Navigation";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, DollarSign, Leaf, Award } from "lucide-react";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Waste Analytics</h1>
          <p className="text-muted-foreground">
            Track your food waste reduction and sustainable habits
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Money Saved"
            value="₹2,450"
            description="This month"
            icon={DollarSign}
            trend={{ value: "12% from last month", isPositive: true }}
          />
          <StatsCard
            title="Food Saved"
            value="8.5 kg"
            description="This month"
            icon={TrendingDown}
            trend={{ value: "15% from last month", isPositive: true }}
          />
          <StatsCard
            title="CO₂ Reduced"
            value="12.3 kg"
            description="Carbon footprint"
            icon={Leaf}
            trend={{ value: "8% from last month", isPositive: true }}
          />
          <StatsCard
            title="Current Streak"
            value="14 days"
            description="Zero waste days"
            icon={Award}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievement Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "Week Warrior", emoji: "🏆", unlocked: true },
                  { name: "Eco Champion", emoji: "🌱", unlocked: true },
                  { name: "Recipe Master", emoji: "👨‍🍳", unlocked: true },
                  { name: "Month Hero", emoji: "⭐", unlocked: false },
                  { name: "Zero Waste", emoji: "♻️", unlocked: false },
                  { name: "Savings Star", emoji: "💰", unlocked: false },
                ].map((badge, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                      badge.unlocked
                        ? "border-primary bg-primary/5"
                        : "border-muted bg-muted/20 opacity-50"
                    }`}
                  >
                    <span className="text-4xl mb-2">{badge.emoji}</span>
                    <span className="text-xs text-center font-medium">{badge.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Food Waste Reduction</span>
                  <span className="text-sm font-bold text-success">85%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary w-[85%]" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Recipe Usage</span>
                  <span className="text-sm font-bold text-success">72%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary w-[72%]" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Ingredient Tracking</span>
                  <span className="text-sm font-bold text-success">95%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary w-[95%]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
