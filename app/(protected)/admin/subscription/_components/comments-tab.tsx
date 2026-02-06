"use client";

import DeleteDialog from "@/components/delete-dialog";
import PagePagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  EllipsisVertical,
  Search,
  SquaresIntersect,
  Trash2Icon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { customFormatDateText, formattedDate } from "@/utils";
import { cn } from "@/lib/utils";
import FilterComments from "../../blogs/_components/filter-comments";
import ToggleCommentStatusForm from "../../blogs/_components/toggle-comment-status-form";

const CommentsTab = () => {
  const trpc = useTRPC();

  const PAGE_SIZE = 20;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();

  const filters = React.useMemo(() => {
    const f: any = {};
    if (searchTerm) f.search = searchTerm;

    // map UI filter to backend filter fields
    if (["PENDING", "APPROVED", "REJECTED"].includes(filter)) {
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
  }, [searchTerm, filter, customStartDate, customEndDate]);

  const {
    data: comments,
    isLoading: iscommentsLoading,
    refetch,
  } = useQuery(
    trpc.adminGetComments.queryOptions({
      type: "SUBSCRIPTION",
      filters,
      pageNumber: currentPage,
      pageSize: PAGE_SIZE,
    })
  );

  const { data: count } = useQuery(
    trpc.adminGetCommentsCount.queryOptions({ type: "SUBSCRIPTION", filters })
  );

  const {
    mutate: deleteMutation,
    isPending: isDeleting,
    isSuccess,
  } = useMutation(trpc.adminDeleteComment.mutationOptions());

  const {
    mutate: handleStatusToggle,
    isPending: isToggleStatusLoading,
    isSuccess: isToggleStatusSuccess,
  } = useMutation(trpc.adminUpdateCommentStatus.mutationOptions());

  useEffect(() => {
    if (!customStartDate || !customEndDate) return;

    setFilter("custom-date");
  }, [customStartDate, customEndDate]);

  const totalPages = Math.ceil(count! / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    if (page >= 1) {
      setCurrentPage(page);
    }
  };
  return (
    <>
      <Card className="w-full">
        <CardContent className="pt-6 mb-4">
          <div className="flex comments-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search comments by Subscriber's email or comment..."
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
              <FilterComments
                filter={filter}
                setFilter={setFilter}
                customEndDate={customEndDate}
                customStartDate={customStartDate}
                setCustomEndDate={setCustomEndDate}
                setCustomStartDate={setCustomStartDate}
              />
            </div>
          </div>

          {iscommentsLoading ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500 animate-pulse">
                Loading Subscription Comments...
              </h3>
            </div>
          ) : comments?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500">
                No Comment Found
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
                  <TableHead className="text-center">Date Created</TableHead>
                  <TableHead className="text-center">Subscriber</TableHead>
                  <TableHead className="text-center">Comment</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments!.map((comment) => (
                  <TableRow key={comment.id} className="text-center">
                    <TableCell>
                      {customFormatDateText(comment.createdAt)}
                    </TableCell>
                    <TableCell className="truncate max-w-[250px]">
                      {comment.user!.email}
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="truncate max-w-[300px]">
                            {comment.content}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="size-auto p-3 whitespace-pre-line break-words">
                          {comment.content}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "rounded-full py-1 px-2 lowercase",
                          comment.status === "PENDING"
                            ? "text-gray-600 bg-gray-600/20"
                            : comment.status === "APPROVED"
                              ? "text-green-600 bg-green-600/20"
                              : "text-destructive bg-destructive/20"
                        )}
                      >{comment.status}</span>
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
                          {comment.status === "PENDING" && (
                            <>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <ToggleCommentStatusForm
                                  dataId={comment.id}
                                  status={"APPROVED"}
                                  handleStatusToggle={handleStatusToggle}
                                  mutationLoading={isToggleStatusLoading}
                                  isSuccess={isToggleStatusSuccess}
                                  refetch={refetch}
                                >
                                  <div className="flex comments-center gap-2 p-1 cursor-pointer text-cyan-600">
                                    <SquaresIntersect className="size-4 text-cyan-600" />
                                    <span className="text-sm">
                                      Approve Comment
                                    </span>
                                  </div>
                                </ToggleCommentStatusForm>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <ToggleCommentStatusForm
                                  dataId={comment.id}
                                  status={"REJECTED"}
                                  handleStatusToggle={handleStatusToggle}
                                  mutationLoading={isToggleStatusLoading}
                                  isSuccess={isToggleStatusSuccess}
                                  refetch={refetch}
                                >
                                  <div className="flex comments-center gap-2 p-1 cursor-pointer text-amber-600">
                                    <SquaresIntersect className="size-4 text-amber-600" />
                                    <span className="text-sm">
                                      Reject Comment
                                    </span>
                                  </div>
                                </ToggleCommentStatusForm>
                              </DropdownMenuItem>
                            </>
                          )}
                          {comment.status === "APPROVED" && (
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <ToggleCommentStatusForm
                                dataId={comment.id}
                                status={"REJECTED"}
                                handleStatusToggle={handleStatusToggle}
                                mutationLoading={isToggleStatusLoading}
                                isSuccess={isToggleStatusSuccess}
                                refetch={refetch}
                              >
                                <div className="flex comments-center gap-2 p-1 cursor-pointer text-amber-600">
                                  <SquaresIntersect className="size-4 text-amber-600" />
                                  <span className="text-sm">
                                    Reject Comment
                                  </span>
                                </div>
                              </ToggleCommentStatusForm>
                            </DropdownMenuItem>
                          )}
                          {comment.status === "REJECTED" && (
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <ToggleCommentStatusForm
                                dataId={comment.id}
                                status={"APPROVED"}
                                handleStatusToggle={handleStatusToggle}
                                mutationLoading={isToggleStatusLoading}
                                isSuccess={isToggleStatusSuccess}
                                refetch={refetch}
                              >
                                <div className="flex comments-center gap-2 p-1 cursor-pointer text-cyan-600">
                                  <SquaresIntersect className="size-4 text-cyan-600" />
                                  <span className="text-sm">
                                    Approve Comment
                                  </span>
                                </div>
                              </ToggleCommentStatusForm>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <DeleteDialog
                              dataId={comment.id}
                              title={"comment"}
                              handleDelete={deleteMutation}
                              mutationLoading={isDeleting}
                              isSuccess={isSuccess}
                              refetch={refetch}
                            >
                              <div className="flex comments-center gap-2 px-1 cursor-pointer text-destructive">
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

export default CommentsTab;
