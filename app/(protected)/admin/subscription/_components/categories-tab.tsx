"use client";

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
import { cn } from "@/lib/utils";
import { Edit3, EllipsisVertical, Trash2Icon } from "lucide-react";
import React from "react";
import UpdateCategoryForm from "./update-category-form";
import DeleteDialog from "@/components/delete-dialog";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";

interface iComProps {
  categories:
    | {
        id: string;
        name: string;
        minOdds: number;
        maxOdds: number;
        uniqueColor: string;
        createdAt: string;
        updatedAt: string;
      }[]
    | undefined;
  isLoading: boolean;
  refetch: () => void;
}

const CategoriesTab = ({ categories, isLoading, refetch }: iComProps) => {
  const trpc = useTRPC();

  const {
    mutate: deleteMutation,
    isPending: isDeleting,
    isSuccess,
  } = useMutation(trpc.adminDeleteSubscriptionCategory.mutationOptions());

  return (
    <Card className="w-full">
      <CardContent>
        <div className="rounded-md border">
          {isLoading ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500 animate-pulse">
                Loading Subscription Categories...
              </h3>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="text-center">
                  <TableHead className="text-center">Title</TableHead>
                  <TableHead className="text-center">Minimum Odds</TableHead>
                  <TableHead className="text-center">Maximum Odds</TableHead>
                  <TableHead className="text-center">Date Created</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories!.map((item) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell>
                      <span
                        className={cn("py-1 px-2 rounded-full capitalize")}
                        style={{
                          backgroundColor: `rgba(${parseInt(item.uniqueColor.slice(1, 3), 16)}, ${parseInt(
                            item.uniqueColor.slice(3, 5),
                            16
                          )}, ${parseInt(item.uniqueColor.slice(5, 7), 16)}, 0.2)`,
                          color: item.uniqueColor,
                        }}
                      >
                        {item.name}
                      </span>
                    </TableCell>
                    <TableCell>{item.minOdds.toString()}</TableCell>
                    <TableCell>{item.maxOdds.toString()}</TableCell>
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
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
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
                              <UpdateCategoryForm
                                refetchCategories={refetch}
                                category={item}
                              />
                            </DialogContent>
                          </Dialog>
                          {item.name !== "free" && (
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <DeleteDialog
                                dataId={item.id}
                                title={`${item.name} subscription category`}
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
