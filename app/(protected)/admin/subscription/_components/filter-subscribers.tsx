"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Filter, Loader2 } from "lucide-react";
import React from "react";

interface iComProps {
  filter: string;
  isActive?: boolean;
  isFreezed?: boolean;
  selectedCategory: string;
  setFilter: (value: string) => void;
  setIsActive: (value: boolean) => void;
  setIsFreezed: (value: boolean) => void;
  setSelectedCategory: (value: string) => void;
}

const isFreezedParams = [
  { name: "Active Sub", value: false },
  { name: "Freezed Sub", value: true },
];

const isActiveParams = [
  { name: "Valid Sub", value: true },
  { name: "Expired Sub", value: false },
];

const FilterSubscribers = ({
  filter,
  isActive,
  isFreezed,
  selectedCategory,
  setFilter,
  setIsActive,
  setIsFreezed,
  setSelectedCategory,
}: iComProps) => {
  const trpc = useTRPC();
  const { data: subscriptionCategories, isLoading: isCategoryLoading } =
    useQuery(trpc.adminGetSubscriptionCategories.queryOptions());
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
          {filter === "category"
            ? subscriptionCategories!.find(
                (category) => category!.id === selectedCategory
              )!.name
            : filter === "active-status"
              ? isActive
                ? "Valid Sub"
                : "Expired Sub"
              : filter === "freeze-status"
                ? isFreezed
                  ? "Freezed Sub"
                  : "Active Sub"
                : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="size-fit flex items-center justify-start flex-col gap-0">
        <div className="w-full flex flex-row justify-around items-center">
          {isFreezedParams.map((params, index) => (
            <Button
              key={index}
              className={cn(
                "w-[45%]",
                filter === "freeze-status" &&
                  isFreezed === params.value &&
                  "bg-primary"
              )}
              variant={"ghost"}
              onClick={() => {
                setFilter("freeze-status");
                setIsFreezed(params.value);
              }}
            >
              {params.name}{" "}
              {filter === "freeze-status" && isFreezed === params.value && "✓"}
            </Button>
          ))}
        </div>
        <div className="w-full h-[1px] bg-muted-foreground/60" />
        <div className="w-full flex flex-row justify-around items-center">
          {isActiveParams.map((params, index) => (
            <Button
              key={index}
              className={cn(
                "w-[45%]",
                filter === "active-status" &&
                  isActive === params.value &&
                  "bg-primary"
              )}
              variant={"ghost"}
              onClick={() => {
                setFilter("active-status");
                setIsActive(params.value);
              }}
            >
              {params.name}{" "}
              {filter === "active-status" && isActive === params.value && "✓"}
            </Button>
          ))}
              </div>
              <div className="w-full h-[1px] bg-muted-foreground/60" />
        {isCategoryLoading ? (
          <div className="py-2 w-full flex items-center justify-center">
            <Loader2 className="animate-spin siize-4" />
          </div>
        ) : (
          subscriptionCategories
            ?.filter((param) => param.name !== "free")
            .map((params) => (
              <Button
                key={params.id}
                variant={"ghost"}
                className={cn(
                  "w-full capitalize",
                  filter === "category" &&
                    selectedCategory === params.id &&
                    "bg-primary"
                )}
                onClick={() => {
                  setFilter("category");
                  setSelectedCategory(params.id!);
                }}
              >
                {params.name}{" "}
                {filter === "category" && selectedCategory === params.id && "✓"}
              </Button>
            ))
        )}
        <div className="w-full h-[1px] bg-muted-foreground/60" />
        <Button
          variant={"ghost"}
          onClick={() => {
            setFilter("");
            setSelectedCategory("");
          }}
        >
          Reset
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default FilterSubscribers;
