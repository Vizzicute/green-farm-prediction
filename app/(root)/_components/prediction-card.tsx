"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Predictions } from "@/types";
import { format, parseISO } from "date-fns";
import { Clock } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

interface iComProps {
  prediction: Predictions;
}

const PredictionCard = ({ prediction }: iComProps) => {
  const pathname = usePathname();

  function getTips() {
    let tip = prediction.tip;
    switch (pathname) {
      case "/":
        tip = prediction.tip;
        break;

      case "/banker":
        tip = prediction.tip;
        break;
      
      case "/basketball":
        tip = prediction.tip;
        break;

      case "/either":
        tip = prediction.either;
        break;

      case "/draw":
        tip = prediction.tip;
        break;

      case "/htft":
        tip = prediction.htft;
        break;

      case "/btts":
        tip = "btts";
        break;

      case "/chance":
        tip = prediction.chance;
        break;

      case "/overs":
        tip = prediction.over;
        break;

      default:
        tip = prediction.tip;
        break
    }

    return tip;
  }
  return (
    <Card className="w-full rounded-xs sm:w-[45%] lg:w-[30%] 2xl:w-[23%] bg-primary/5">
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-center justify-between mx-0">
            <Badge
              variant={"outline"}
              className="rounded-full text-[12px] capitalize"
            >
              {prediction.sport === "FOOTBALL" ? "Football" : "Basketball"}
            </Badge>
            <span className="text-[12px] text-muted-foreground text-center">
              {prediction.league}
            </span>
            <div className="flex gap-1 text-[12px]">
              <Clock className="size-4" />
              <span>{format(parseISO(prediction.datetime), "h:mma")}</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="w-full flex items-center justify-center gap-2">
              <div className="w-[45%] flex text-wrap items-center justify-center">
                {prediction.homeTeam}
              </div>
              <div className="w-[10%] flex text-wrap items-center justify-center">
                <span className="font-semibold text-stone-500">Vs</span>
              </div>
              <div className="w-[45%] flex text-wrap items-center justify-center">
                {prediction.awayTeam}
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center justify-center">
              <span className="text-sm">Scores:</span>
              <span
                className={cn(
                  prediction.status === "WON"
                    ? "text-green-600"
                    : prediction.status === "LOST"
                      ? "text-red-600"
                      : "text-gray-600"
                )}
              >
                {prediction.homescore}:{prediction.awayscore}
              </span>
            </div>
          </div>
          <div className="w-full flex items-center justify-around">
            <div className="flex flex-col items-center justify-center">
              <span className="text-muted-foreground">Tips</span>
              <span className="text-wrap text-sm">{getTips()}</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-muted-foreground">Win Prob %</span>
              <span className="text-sm">
                {prediction.winProb}%
              </span>
            </div>
            {(pathname === "/" || pathname === "/banker" || pathname === "/dashboard") && (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-muted-foreground">Odds</span>
                  <span className="text-sm">{prediction.odds}</span>
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
