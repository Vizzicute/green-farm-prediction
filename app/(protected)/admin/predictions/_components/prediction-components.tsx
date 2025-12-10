"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Edit,
  Edit3,
  EllipsisVertical,
  Search,
  Trash2Icon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import FilterPredictions from "./filter-predictions";
import SortPredictions from "./sort-predictions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { customFormatDateText, formattedDate, formattedTime } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useTRPC } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DeleteDialog from "@/components/delete-dialog";
import UpdateResultForm from "./update-result-form";
import PagePagination from "@/components/pagination";

const PredictionComponents = () => {
  const trpc = useTRPC();

  const PAGE_SIZE = 20;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [selectedSubscriptionCategoryId, setSelectedSubscriptionCategoryId] =
    useState<string>("");
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();

  const filters = React.useMemo(() => {
    const f: any = {};
    if (searchTerm) f.search = searchTerm;
    if (selectedSubscriptionCategoryId && filter === "sub-cat")
      f.subscriptionCategoryId = selectedSubscriptionCategoryId;

    // map UI filter to backend filter fields
    if (["WON", "LOST", "VOID", "PENDING"].includes(filter)) {
      f.status = filter;
    } else if (filter === "today") {
      const d = new Date();
      const date = formattedDate(d);
      f.customStartDate = f.customEndDate = date;
    } else if (filter === "yesterday") {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const date = formattedDate(d);
      f.customStartDate = f.customEndDate = date;
    } else if (filter === "tomorrow") {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      const date = formattedDate(d);
      f.customStartDate = f.customEndDate = date;
    } else if (filter === "custom-date" && customStartDate && customEndDate) {
      f.customStartDate = formattedDate(customStartDate);
      f.customEndDate = formattedDate(customEndDate);
    }

    return f;
  }, [
    searchTerm,
    selectedSubscriptionCategoryId,
    filter,
    customStartDate,
    customEndDate,
  ]);

  const {
    data: predictions,
    isLoading: isPredictionLoading,
    refetch,
  } = useQuery(
    trpc.getAdminPredictions.queryOptions({
      filters,
      currentPage,
      pageSize: PAGE_SIZE,
    })
  );

  const { data: subscriptionCategories } = useQuery(
    trpc.adminGetSubscriptionCategories.queryOptions()
  );

  const { data: count } = useQuery(
    trpc.getAdminPredictionsCount.queryOptions({ filters })
  );

  const {
    mutate: deleteMutation,
    isPending: isDeleting,
    isSuccess,
  } = useMutation(trpc.adminDeletePrediction.mutationOptions());

  useEffect(() => {
    if (!customStartDate || !customEndDate) return;

    setFilter("custom-date");
  }, [customStartDate, customEndDate]);

  useEffect(() => {
    switch (sort) {
      case "league-asc":
        predictions?.sort((a, b) => a.league.localeCompare(b.league));
        break;
      case "league-desc":
        predictions?.sort((a, b) => b.league.localeCompare(a.league));
        break;
      case "hometeam-asc":
        predictions?.sort((a, b) => a.homeTeam.localeCompare(b.homeTeam));
        break;
      case "hometeam-desc":
        predictions?.sort((a, b) => b.homeTeam.localeCompare(a.homeTeam));
        break;
      case "awayteam-asc":
        predictions?.sort((a, b) => a.awayTeam.localeCompare(b.awayTeam));
        break;
      case "awayteam-desc":
        predictions?.sort((a, b) => b.awayTeam.localeCompare(a.awayTeam));
        break;
      default:
        break;
    }
  }, [sort, predictions]);

  const totalPages = Math.ceil(count! / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    if (page >= 1) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Predictions by Team or Leagues..."
                className="pl-8"
                defaultValue={searchTerm}
                onChange={(e) => {
                  const delayMs = 2000;
                  const val = e.target.value;
                  if ((window as any)._predSearchTimer) {
                    clearTimeout((window as any)._predSearchTimer);
                  }
                  (window as any)._predSearchTimer = setTimeout(() => {
                    setSearchTerm(val);
                  }, delayMs);
                }}
              />
            </div>
            <div className="ml-2 flex space-x-2">
              <FilterPredictions
                filter={filter}
                setFilter={setFilter}
                customEndDate={customEndDate}
                customStartDate={customStartDate}
                setCustomEndDate={setCustomEndDate}
                setCustomStartDate={setCustomStartDate}
                subscriptionCategories={subscriptionCategories!}
                selectedCategory={selectedSubscriptionCategoryId}
                setSelectedCategory={setSelectedSubscriptionCategoryId}
              />
              <SortPredictions sort={sort} setSort={setSort} />
            </div>
          </div>

          {isPredictionLoading ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500 animate-pulse">
                Loading Predictions...
              </h3>
            </div>
          ) : predictions?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500">
                No predictions found
              </h3>
              {searchTerm !== "" && (
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search criteria
                </p>
              )}
              {filter !== "" && (
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your filter criteria
                </p>
              )}
            </div>
          ) : (
            <Table className="no-scrollbar">
              <TableHeader>
                <TableRow className="text-center">
                  <TableHead className="text-center">Time</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">League</TableHead>
                  <TableHead className="text-center">Matches</TableHead>
                  <TableHead className="text-center">Tips</TableHead>
                  <TableHead className="text-center">Scores</TableHead>
                  <TableHead className="text-center">Plan</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions?.map((data) => (
                  <TableRow key={data.id} className="text-center">
                    <TableCell>
                      {formattedTime(new Date(data.datetime))}
                    </TableCell>
                    <TableCell>
                      {customFormatDateText(data.datetime)}
                    </TableCell>
                    <TableCell>{data.league}</TableCell>
                    <TableCell>
                      {data.homeTeam}{" "}
                      <span className="font-semibold text-primary">vs</span>{" "}
                      {data.awayTeam}
                    </TableCell>
                    <TableCell>{data.tip}</TableCell>
                    <TableCell
                      className={`${
                        data.status === "WON"
                          ? "text-green-500"
                          : data.status === "LOST"
                            ? "text-red-500"
                            : data.status === "VOID"
                              ? "text-gray-500"
                              : ""
                      }`}
                    >
                      {data.homescore}:{data.awayscore}
                    </TableCell>
                    <TableCell className="capitalize">
                      {data.SubscriptionCategory!.name}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"} className="size-8 p-0">
                            <EllipsisVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Link
                              href={`/admin/predictions/${data.id}/edit`}
                              className="flex items-center gap-2 px-1 cursor-pointer"
                            >
                              <Edit3 className="size-4" />
                              <span className="text-sm">Edit</span>
                            </Link>
                          </DropdownMenuItem>
                          {new Date(data.datetime) <= today && (<Dialog>
                            <DialogTrigger>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <div className="flex items-left gap-2 px-1 cursor-pointer">
                                  <Edit className="size-4" />
                                  <span className="text-sm">Update Result</span>
                                </div>
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[50%] sm:max-h-[90%] sm:h-fit">
                              <DialogHeader>
                                <DialogTitle className="text-center">
                                  Update Result
                                </DialogTitle>
                                <DialogDescription className="w-full flex flex-col justify-center items-center">
                                  <span className="flex items-center justify-center gap-2 font-semibold">
                                    <span className="capitalize">
                                      {data.homeTeam}
                                    </span>
                                    <span>Vs</span>
                                    <span className="capitalize">
                                      {data.awayTeam}
                                    </span>
                                  </span>
                                  <span className="text-center">
                                    Prediction: {data.tip}
                                  </span>
                                </DialogDescription>
                              </DialogHeader>
                              <UpdateResultForm
                                prediction={data}
                                refetch={refetch}
                              />
                            </DialogContent>
                          </Dialog>)}
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <DeleteDialog
                              dataId={data.id}
                              title={`prediction`}
                              handleDelete={deleteMutation}
                              mutationLoading={isDeleting}
                              isSuccess={isSuccess}
                              refetch={refetch}
                            >
                              <div className="flex items-center gap-2 px-1 cursor-pointer text-destructive">
                                <Trash2Icon className="size-4 text-destructive" />
                                <span className="text-sm">Delete</span>
                              </div>
                            </DeleteDialog>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <PagePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                />
              </div>
            )}
    </>
  );
};

export default PredictionComponents;
