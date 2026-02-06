"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ArrowDownAZ, ArrowUpZA } from "lucide-react";
import React from "react";

interface iComProps {
  sort: string;
  setSort: (value: string) => void;
}

const sortParams = [
  { name: "League Asc", value: "league-asc" },
  { name: "League Desc", value: "league-desc" },
  { name: "HomeTeam Asc", value: "hometeam-asc" },
  { name: "HomeTeam Desc", value: "hometeam-desc" },
  { name: "AwayTeam Asc", value: "awayteam-asc" },
  { name: "AwayTeam Desc", value: "awayteam-desc" },
];

const SortPredictions = ({ sort, setSort }: iComProps) => {
  return (
    <Popover modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("flex items-start", sort !== "" && "bg-primary")}
        >
          {sort === "" ? (
            <>
              <ArrowDownAZ className="ms-1 mr-1 h-4 w-4" />
              Sort By
            </>
          ) : sort === "league-asc" ? (
            <>
              Sort By: League
              <ArrowDownAZ className="ms-1 mr-1 h-4 w-4" />
            </>
          ) : sort === "league-desc" ? (
            <>
              Sort By: League
              <ArrowUpZA className="ms-1 mr-1 h-4 w-4" />
            </>
          ) : sort === "hometeam-asc" ? (
            <>
              Sort By: Home Team
              <ArrowDownAZ className="ms-1 mr-1 h-4 w-4" />
            </>
          ) : sort === "hometeam-desc" ? (
            <>
              Sort By: Home Team
              <ArrowUpZA className="ms-1 mr-1 h-4 w-4" />
            </>
          ) : sort === "awayteam-asc" ? (
            <>
              Sort By: Away Team
              <ArrowDownAZ className="ms-1 mr-1 h-4 w-4" />
            </>
          ) : (
            <>
              Sort By: Away Team
              <ArrowUpZA className="ms-1 mr-1 h-4 w-4" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="w-full flex flex-col text-[10px]">
          {sortParams.map((params) => (
            <Button
              key={params.value}
              variant={"ghost"}
              onClick={() => setSort(params.value)}
            >
              {params.name}
            </Button>
          ))}
          <Button variant={"ghost"} onClick={() => setSort("")}>
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SortPredictions;
