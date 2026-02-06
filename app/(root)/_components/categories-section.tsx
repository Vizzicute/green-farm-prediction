"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Activity,
  Award,
  BarChart3,
  Clock,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  sport: "Football" | "Basketball" | "Both";
  isPopular?: boolean;
  href: string;
}

const categories: Category[] = [
  {
    id: "over-under",
    title: "Over/Under Goals",
    description: "Predict total goals in football matches",
    icon: Target,
    sport: "Football",
    isPopular: true,
    href: "/overs",
  },
  {
    id: "draw",
    title: "Draw Predictions",
    description: "Identify matches likely to end in a draw",
    icon: BarChart3,
    sport: "Football",
    href: "/draw",
  },
  {
    id: "double-chance",
    title: "Double Chance",
    description: "Cover two of three possible outcomes",
    icon: TrendingUp,
    sport: "Football",
    href: "/chance",
  },
  {
    id: "team-win-half",
    title: "Team to Win Either Half",
    description: "Predict which team wins 1st or 2nd half",
    icon: Clock,
    sport: "Football",
    href: "/either",
  },
  {
    id: "halftime-fulltime",
    title: "Halftime/Fulltime",
    description: "Predict results at HT and FT",
    icon: Award,
    sport: "Football",
    href: "/htft",
  },
  {
    id: "both-teams-score",
    title: "Both Teams to Score",
    description: "Will both teams find the net?",
    icon: Users,
    sport: "Football",
    isPopular: true,
    href: "/btts",
  },
  {
    id: "total-points",
    title: "Total Points Over/Under",
    description: "Predict total points in basketball games",
    icon: Activity,
    sport: "Basketball",
    isPopular: true,
    href: "/basketball-over",
  },
  {
    id: "moneyline",
    title: "Winner (Moneyline)",
    description: "Pick the outright winner",
    icon: Trophy,
    sport: "Basketball",
    href: "/basketball",
  },
];
import React from "react";

const CategoriesSection = () => {
  const pathname = usePathname();
  const [filter, setFilter] = useState("all");
  return (
    <div id="categories" className="mt-10 py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Prediction <span className="text-primary">Categories</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose from our wide range of betting markets for football and
            basketball
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Categories
          </Button>
          <Button
            variant={filter === "football" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("football")}
          >
            Football
          </Button>
          <Button
            variant={filter === "basketball" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("basketball")}
          >
            Basketball
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {categories
            .filter((category) =>
              filter === "all" ? true : category.sport.toLowerCase() === filter
            )
            .filter((category) => category.href !== pathname)
            .sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
            .map((category) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={category.id}
                  className="relative group cursor-pointer bg-gradient-to-br from-card to-card/80 border-border hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1"
                >
                  {category.isPopular && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-semibold">
                        Popular
                      </div>
                    </div>
                  )}

                  <div className="py-2 px-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="size-6 text-primary" />
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                        {category.sport}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {category.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-border">
                      <Link
                        href={category.href}
                        className={cn(
                          buttonVariants({
                            className: "text-primary hover:bg-primary/10",
                            variant: "ghost",
                            size: "sm",
                          })
                        )}
                      >
                        View Predictions →
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;
