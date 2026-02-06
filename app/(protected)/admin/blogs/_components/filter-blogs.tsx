"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Filter } from "lucide-react";
import React from "react";

interface iComProps {
  filter: string;
  setFilter: (value: string) => void;
  customStartDate: Date | undefined;
  setCustomStartDate: (value: Date) => void;
  customEndDate: Date | undefined;
  setCustomEndDate: (value: Date) => void;
}

const filterParams = [
  { name: "Published", value: "PUBLISHED" },
  { name: "Draft", value: "DRAFT" },
  { name: "Scheduled", value: "SCHEDULED" },
  { name: "Archived", value: "ARCHIVED" },
  { name: "Yesterday", value: "yesterday" },
  { name: "Today", value: "today" },
  { name: "Tomorrow", value: "tomorrow" },
];

const FilterBlogs = ({
  filter,
  setFilter,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
}: iComProps) => {
  return (
    <Popover modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex items-start w-auto",
            filter !== "" && "bg-slate-200"
          )}
        >
          <Filter className="mr-2 size-4" />{" "}
          {filter === "" ? "Filter" : "Filter By: "}
          {filter === "PUBLISHED" ? (
            "Published"
          ) : filter === "DRAFT" ? (
            "Draft"
          ) : filter === "SCHEDULED" ? (
            "scheduled"
          ) : filter === "ARCHIVED" ? (
            "Archived"
          ) : filter === "yesterday" ? (
            "Yesterday"
          ) : filter === "today" ? (
            "Today"
          ) : filter === "tomorrow" ? (
            "Tomorrow"
          ) : filter === "custom-date" ? (
            <>
              <span className="w-fit text-[9px] gap-2 flex items-center justify-center">
                <span className="font-semibold text-start">Date Range</span>
                <span className="flex flex-col text-end">
                  <span>from: {customStartDate?.toDateString()}</span>
                  <span>to: {customEndDate?.toDateString()}</span>
                </span>
              </span>
            </>
          ) : (
            ""
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="size-fit flex items-center justify-start flex-col gap-0">
        <div className="w-full flex flex-row justify-around items-center">
          {filterParams
            .filter(
                (param) =>
                  param.value === "yesterday" ||
                  param.value === "today" ||
                  param.value === "tomorrow"
                )
                .map((params) => (
                    <Button
                key={params.value}
                className={cn(
                  "w-[23%]",
                  filter === params.value && "bg-primary"
                )}
                variant={"ghost"}
                onClick={() => setFilter(params.value)}
                >
                {params.name} {filter === params.value && "✓"}
              </Button>
            ))}
        </div>
        {filterParams
          .filter(
              (param) =>
                param.value === "PUBLISHED" ||
                param.value === "ARCHIVED" ||
                param.value === "SCHEDULED" ||
                param.value === "DRAFT"
          )
          .map((params) => (
            <Button
              key={params.value}
              variant={"ghost"}
              className={cn("w-full", filter === params.value && "bg-primary")}
              onClick={() => setFilter(params.value)}
            >
              {params.name} {filter === params.value && "✓"}
            </Button>
          ))}
        <div className="flex flex-row items-center gap-2">
          <span className="text-sm">Custom Date Filter: </span>
          <div className="flex flex-col gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !customStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {customStartDate ? (
                    format(customStartDate, "PPP")
                  ) : (
                    <span>From</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  required={true}
                  selected={customStartDate}
                  onSelect={setCustomStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !customEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {customEndDate ? (
                    format(customEndDate, "PPP")
                  ) : (
                    <span>To</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  required={true}
                  selected={customEndDate}
                  onSelect={setCustomEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {filter === "custom-date" && "✓"}
        </div>
        <Button
          variant={"ghost"}
          onClick={() => {
            setFilter("");
          }}
        >
          Reset
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default FilterBlogs;
