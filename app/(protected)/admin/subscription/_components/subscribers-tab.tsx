"use client";

import DeleteDialog from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Edit3,
  EllipsisVertical,
  Search,
  SquaresIntersect,
  Trash2Icon,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import UpdateSubscriberForm from "./update-subscriber-form";
import FilterSubscribers from "./filter-subscribers";
import UpdateSubscriptionFreezeStatusDialog from "./update-subscription-freeze-status";
import PagePagination from "@/components/pagination";

const PAGE_SIZE = 20;

const SubscribersTab = () => {
  const trpc = useTRPC();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [activeStatus, setActiveStatus] = useState<boolean>();
  const [freezeStatus, setFreezeStatus] = useState<boolean>();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const filters = useMemo(() => {
    const f: any = {};
    if (searchTerm) f.search = searchTerm;

    if (filter === "active-status" && activeStatus !== undefined) {
      f.isActive = activeStatus;
    } else if (filter === "freeze-status" && freezeStatus !== undefined) {
      f.isFreezed = freezeStatus;
    } else if (filter === "category" && selectedCategory !== undefined) {
      f.category = selectedCategory;
    }

    return f;
  }, [searchTerm, filter, activeStatus, freezeStatus, selectedCategory]);

  const {
    data: subscribers,
    isLoading,
    refetch,
  } = useQuery(
    trpc.adminGetSubscriptions.queryOptions({
      filters,
      currentPage,
      pageSize: PAGE_SIZE,
    })
  );

  const { data: count } = useQuery(
    trpc.adminGetSubscriptionsCount.queryOptions({ filters })
  );

  const {
    mutate: deleteMutation,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess,
  } = useMutation(trpc.adminDeleteSubscription.mutationOptions());

  const {
    mutate: updateSubscriptionFreezeStatus,
    isPending: isFreezeLoading,
    isSuccess: isFreezeSuccess,
  } = useMutation(trpc.adminUpdateSubscriptionFreezeStatus.mutationOptions());

   const totalPages = Math.ceil(count! / PAGE_SIZE);

   const handlePageChange = (page: number) => {
     if (page >= 1) {
       setCurrentPage(page);
     }
   };
  return (
    <>
      <Card className="w-full">
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search subscriber by Name or Email..."
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
              <FilterSubscribers
                filter={filter}
                setFilter={setFilter}
                isActive={activeStatus}
                selectedCategory={selectedCategory}
                setIsActive={setActiveStatus}
                isFreezed={freezeStatus}
                setIsFreezed={setFreezeStatus}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
          </div>
          <div className="rounded-md border">
            {isLoading ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-500 animate-pulse">
                  Loading Subscribers...
                </h3>
              </div>
            ) : subscribers?.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-500">
                  No Subscriber found
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
              <Table>
                <TableHeader>
                  <TableRow className="text-center">
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Category</TableHead>
                    <TableHead className="text-center">Duration</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Date Joined</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers?.map((subscriber) => (
                    <TableRow key={subscriber.id} className="text-center">
                      <TableCell
                        className={cn(
                          subscriber.User?.name === "" && "text-amber-600"
                        )}
                      >
                        {subscriber.User?.name === ""
                          ? "No Name"
                          : subscriber.User?.name}
                      </TableCell>
                      <TableCell>{subscriber.User?.email}</TableCell>
                      <TableCell>
                        <span
                          className={cn("py-1 px-2 rounded-full capitalize")}
                          style={{
                            backgroundColor: `rgba(${parseInt(subscriber.SubscriptionCategory!.uniqueColor.slice(1, 3), 16)}, ${parseInt(
                              subscriber.SubscriptionCategory!.uniqueColor.slice(
                                3,
                                5
                              ),
                              16
                            )}, ${parseInt(subscriber.SubscriptionCategory!.uniqueColor.slice(5, 7), 16)}, 0.2)`,
                            color: subscriber.SubscriptionCategory!.uniqueColor,
                          }}
                        >
                          {subscriber.SubscriptionCategory?.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        {subscriber.duration === "D10"
                          ? "10 Days"
                          : subscriber.duration === "D20"
                            ? "20 Days"
                            : "30 Days"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "rounded-full bg-background border px-2 py-1 text-[12px]",
                            subscriber.isActive
                              ? subscriber.isFreezed
                                ? "text-cyan-400 border-cyan-500/30"
                                : "text-green-400 border-green-500/30"
                              : "text-red-400 border-red-500/30"
                          )}
                        >
                          {subscriber.isActive
                            ? subscriber.isFreezed
                              ? "Freezed"
                              : "Active"
                            : "Expired"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(subscriber.createdAt).toDateString()}
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
                            <Dialog>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <DialogTrigger asChild>
                                  <div className="flex items-center gap-2 p-1 cursor-pointer">
                                    <Edit3 className="size-4" />
                                    <span className="text-sm">Edit</span>
                                  </div>
                                </DialogTrigger>
                              </DropdownMenuItem>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Subscription</DialogTitle>
                                </DialogHeader>
                                <UpdateSubscriberForm
                                  refetchSubscribers={refetch}
                                  userId={subscriber.User?.id!}
                                  subscriberId={subscriber.id}
                                  duration={subscriber.duration}
                                  subCatId={subscriber.subscriptionCategoryId!}
                                />
                              </DialogContent>
                            </Dialog>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <UpdateSubscriptionFreezeStatusDialog
                                dataId={subscriber.id}
                                isFreezed={subscriber.isFreezed}
                                handleUpdateFreezedStatus={
                                  updateSubscriptionFreezeStatus
                                }
                                mutationLoading={isFreezeLoading}
                                isSuccess={isFreezeSuccess}
                                refetch={refetch}
                              >
                                <div
                                  className={cn(
                                    "flex items-center gap-2 p-1 cursor-pointer",
                                    subscriber.isFreezed
                                      ? "text-cyan-600"
                                      : "text-amber-600"
                                  )}
                                >
                                  <SquaresIntersect
                                    className={cn(
                                      "size-4 text-destructive",
                                      subscriber.isFreezed
                                        ? "text-cyan-600"
                                        : "text-amber-600"
                                    )}
                                  />
                                  <span className="text-sm">
                                    {subscriber.isFreezed
                                      ? "Unfreeze"
                                      : "Freeze"}{" "}
                                    Subscription
                                  </span>
                                </div>
                              </UpdateSubscriptionFreezeStatusDialog>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <DeleteDialog
                                dataId={subscriber.id}
                                title="subscription"
                                handleDelete={deleteMutation}
                                mutationLoading={isDeleting}
                                isSuccess={isDeleteSuccess}
                                refetch={refetch}
                              >
                                <div className="flex items-center gap-2 p-1 cursor-pointer text-destructive">
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
          </div>
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

export default SubscribersTab;
