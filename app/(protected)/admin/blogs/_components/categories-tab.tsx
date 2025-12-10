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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/lib/trpc/client";
import { env } from "@/schema/env";
import { useMutation } from "@tanstack/react-query";
import { Edit3, EllipsisVertical, Trash2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import UpdateBlogCategoryForm from "./update-blog-category-form";

interface iComProps {
  refetch: () => void;
  isLoading: boolean;
  categories:
    | {
        id: string;
        name: string;
        slug: string;
        createdAt: string;
        updatedAt: string;
      }[]
    | undefined;
}

const CategoriesTab = ({ refetch, isLoading, categories }: iComProps) => {
  const trpc = useTRPC();

  const {
    mutate: deleteMutation,
    isPending: isDeleting,
    isSuccess,
  } = useMutation(trpc.adminDeleteBlogCategory.mutationOptions());
  return (
    <Card className="w-full">
      <CardContent>
        <div className="rounded-md border">
          {isLoading ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500 animate-pulse">
                Loading Blogs Categories...
              </h3>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="text-center">
                  <TableHead className="text-center">Title</TableHead>
                  <TableHead className="text-center">Url</TableHead>
                  <TableHead className="text-center">Date Created</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories!.map((item) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Link
                        href={`${env.NEXT_PUBLIC_APP_URL}/blog/category${item.slug}`}
                        className="hover:text-primary underline"
                        target="_blank"
                      >
                        {env.NEXT_PUBLIC_APP_URL}/blog/category{item.slug}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toDateString()}
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
                                <div className="flex items-center gap-2 px-1 cursor-pointer">
                                  <Edit3 className="size-4" />
                                  <span className="text-sm">Edit</span>
                                </div>
                              </DialogTrigger>
                            </DropdownMenuItem>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Edit {item.name} Category
                                </DialogTitle>
                              </DialogHeader>
                              <UpdateBlogCategoryForm
                                refetch={refetch}
                                category={item}
                              />
                            </DialogContent>
                          </Dialog>
                          {item.name !== "free" && (
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <DeleteDialog
                                dataId={item.id}
                                title={"blog category"}
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
                          )}
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
  );
};

export default CategoriesTab;
