"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import React from "react";
import PredictionCard from "./prediction-card";
import { dateString } from "@/utils";
import { Predictions } from "@/types";
import { isAfter } from "date-fns";

interface iComProps {
  predictions: Predictions[] | undefined;
  isLoading: boolean;
  customDate: Date;
  setCustomDate: React.Dispatch<React.SetStateAction<Date>>;
}

const PredictionSection = ({
  predictions,
  isLoading,
  customDate,
  setCustomDate,
}: iComProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center space-y-2">
      <div className="flex items-center justify-center gap-4 md:gap-6">
        <Button
          variant={"outline"}
          onClick={() =>
            setCustomDate((d) => {
              if (!d) return d;
              const next = new Date(d);
              next.setDate(next.getDate() - 1);
              return next;
            })
          }
        >
          Previous Day
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("justify-start text-left font-normal")}
            >
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              required={true}
              selected={customDate}
              onSelect={setCustomDate}
            />
          </PopoverContent>
        </Popover>
        <Button
          variant={"outline"}
          onClick={() =>
            setCustomDate((d) => {
              if (!d) return d;
              const next = new Date(d);
              next.setDate(next.getDate() + 1);
              return next;
            })
          }
        >
          Next Day
        </Button>
      </div>
      <h3 className="text-center">
        Free Predictions - {dateString(customDate)}
      </h3>
      <div className="w-full flex flex-row flex-wrap items-center justify-center gap-2 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center gap-1">
            <Loader2 className="size-4 animate-spin" />{" "}
            <span className="animate-pulse">Loading Predictions...</span>
          </div>
        ) : predictions !== undefined && predictions.length === 0 ? (
          <span className="font-semibold">
            {isAfter(customDate, new Date())
              ? "No Prediction Yet!"
              : "No Prediction Added!"}
          </span>
        ) : (
          predictions?.map((prediction) => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))
        )}
      </div>
    </div>
  );
};

export default PredictionSection;
