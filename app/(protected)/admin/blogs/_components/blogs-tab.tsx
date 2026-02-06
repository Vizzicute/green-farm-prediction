"use client";

import DeleteDialog from "@/components/delete-dialog";
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
import { cn } from "@/lib/utils";
import { env } from "@/schema/env";
import { customFormatDateText, formattedDate } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Edit3,
  EllipsisVertical,
  Search,
  SquaresIntersect,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ToggleBlogStatusForm from "./toggle-blog-status-form";
import FilterBlogs from "./filter-blogs";
import Image from "next/image";
import { useConstructUrl } from "@/hooks/use-construct-url";
import PagePagination from "@/components/pagination";

const BlogsTab = () => {
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
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();

  const filters = React.useMemo(() => {
    const f: any = {};
    if (searchTerm) f.search = searchTerm;

    // map UI filter to backend filter fields
    if (["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"].includes(filter)) {
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
    data: blogs,
    isLoading: isBlogsLoading,
    refetch,
  } = useQuery(
    trpc.adminGetBlogPosts.queryOptions({
      filters,
      page: currentPage,
      pageSize: PAGE_SIZE,
    })
  );

  const { data: count } = useQuery(
    trpc.adminGetBlogPostsCount.queryOptions({ filters })
  );

  const {
    mutate: deleteMutation,
    isPending: isDeleting,
    isSuccess,
  } = useMutation(trpc.adminDeleteBlogPost.mutationOptions());

  const {
    mutate: handleStatusToggle,
    isPending: isToggleStatusLoading,
    isSuccess: isToggleStatusSuccess,
  } = useMutation(trpc.adminUpdateBlogStatus.mutationOptions());

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
      <Card>
        <CardContent className="pt-6 mb-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search blogs by Team or Leagues..."
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
              <FilterBlogs
                filter={filter}
                setFilter={setFilter}
                customEndDate={customEndDate}
                customStartDate={customStartDate}
                setCustomEndDate={setCustomEndDate}
                setCustomStartDate={setCustomStartDate}
              />
            </div>
          </div>

          {isBlogsLoading ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500 animate-pulse">
                Loading Blog Posts...
              </h3>
            </div>
          ) : blogs?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500">
                No Blog Post found
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
                  <TableHead className="text-center">Img</TableHead>
                  <TableHead className="text-center">Title</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Date Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs?.map((data) => (
                  <TableRow key={data.id} className="text-center">
                    <TableCell className="flex items-center justify-center">
                      <Image src={useConstructUrl(data.featuredImage)} alt={data.title} width={16} height={24} className="size-8 rounded-sm" />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`${env.NEXT_PUBLIC_APP_URL}/blogs/${data.slug}`}
                        target="_blank"
                      >
                        <span className="line-clamp-1">{data.title}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "lowercase rounded-full px-2 py-1 text-sm font-medium",
                          data.status === "PUBLISHED"
                            ? "text-cyan-600 bg-cyan-500/10"
                            : data.status === "SCHEDULED"
                              ? "text-amber-600 bg-amber-500/10"
                              : "text-gray-600 bg-gray-500/10"
                        )}
                      >
                        {data.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {data.publishedAt ? customFormatDateText(data.publishedAt) : "N/A"}
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
                              href={`/admin/blogs/${data.id}/edit`}
                              className="flex items-center gap-2 px-1 cursor-pointer"
                            >
                              <Edit3 className="size-4" />
                              <span className="text-sm">Edit</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <ToggleBlogStatusForm
                              dataId={data.id}
                              status={data.status}
                              handleStatusToggle={handleStatusToggle}
                              mutationLoading={isToggleStatusLoading}
                              isSuccess={isToggleStatusSuccess}
                              refetch={refetch}
                            >
                              <div
                                className={cn(
                                  "flex items-center gap-2 p-1 cursor-pointer",
                                  data.status === "SCHEDULED" ||
                                    data.status === "DRAFT" ||
                                    data.status === "ARCHIVED"
                                    ? "text-cyan-600"
                                    : "text-amber-600"
                                )}
                              >
                                <SquaresIntersect
                                  className={cn(
                                    "size-4 text-destructive",
                                    data.status === "SCHEDULED" ||
                                      data.status === "DRAFT" ||
                                      data.status === "ARCHIVED"
                                      ? "text-cyan-600"
                                      : "text-amber-600"
                                  )}
                                />
                                <span className="text-sm">
                                  {data.status === "SCHEDULED" ||
                                  data.status === "DRAFT" ||
                                  data.status === "ARCHIVED"
                                    ? "Publish"
                                    : "Archive"}{" "}
                                  Blog
                                </span>
                              </div>
                            </ToggleBlogStatusForm>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <DeleteDialog
                              dataId={data.id}
                              title={`blog post`}
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

export default BlogsTab;
