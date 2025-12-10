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
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  BadgeCheckIcon,
  Edit3,
  EllipsisVertical,
  Search,
  SquaresIntersect,
  Trash2Icon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import FilterUsers from "./filter-users";
import UpdateUserRoleForm from "./update-user-role-form";
import { Badge } from "@/components/ui/badge";
import UpdateUserActiveDialog from "./change-active-status-form";
import { formattedDate } from "@/utils";
import PagePagination from "@/components/pagination";

const PAGE_SIZE = 20;

const UserComponent = () => {
  const trpc = useTRPC();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();

  useEffect(() => {
    if (!customStartDate || !customEndDate) return;

    setFilter("custom-date");
  }, [customStartDate, customEndDate]);

  const filters = React.useMemo(() => {
    const f: any = {};
    if (searchTerm) f.search = searchTerm;

    if (["true", "false"].includes(filter)) {
      f.active = filter === "true" ? true : false;
    } else if (filter === "custom-date" && customStartDate && customEndDate) {
      f.customStartDate = formattedDate(customStartDate);
      f.customEndDate = formattedDate(customEndDate);
    }

    return f;
  }, [searchTerm, filter, customStartDate, customEndDate]);

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery(
    trpc.adminGetUsers.queryOptions({
      filters,
      currentPage,
      pageSize: PAGE_SIZE,
    })
    );
  
  const { data: count } = useQuery(
      trpc.adminGetUsersCount.queryOptions({ filters })
    );

  const {
    mutate: deleteMutation,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess,
  } = useMutation(trpc.adminDeleteUser.mutationOptions());

  const {
    mutate: updateUserActiveStatus,
    isPending: isUserActiveStatusUpdating,
    isSuccess: isUserActiveStatusUpdated,
  } = useMutation(trpc.adminUpdateUserActiveStatus.mutationOptions());

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
                placeholder="Search User by Name or Email..."
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
              <FilterUsers
                filter={filter}
                setFilter={setFilter}
                customEndDate={customEndDate}
                customStartDate={customStartDate}
                setCustomEndDate={setCustomEndDate}
                setCustomStartDate={setCustomStartDate}
              />
            </div>
          </div>
          <div className="rounded-md border">
            {isLoading ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-500 animate-pulse">
                  Loading Users...
                </h3>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="text-center">
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Role</TableHead>
                    <TableHead className="text-center">Date Joined</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.sort((a,b) => a.role!.localeCompare(b.role!)).map((user) => (
                    <TableRow key={user.id} className="text-center">
                      <TableCell
                        className={cn(user.name === "" && "text-amber-600")}
                      >
                        {user.name === "" ? "No Name" : user.name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          className="capitalize rounded-full"
                          variant={
                            user.role === "admin"
                              ? "default"
                              : user.role === "staff"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {user.role === "admin" ? (
                            <span className="flex items-center justify-center gap-1">
                              {user.role}{" "}
                              <BadgeCheckIcon className="size-4 text-blue-500" />
                            </span>
                          ) : (
                            user.role
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "rounded-full bg-background border px-2 py-1 text-[12px]",
                            user.active
                              ? "text-green-400 border-green-500/30"
                              : "text-red-400 border-red-500/30"
                          )}
                        >
                          {user.active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      {user.role !== "admin" && (
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
                                      <span className="text-sm">
                                        Update Role
                                      </span>
                                    </div>
                                  </DialogTrigger>
                                </DropdownMenuItem>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Change role</DialogTitle>
                                  </DialogHeader>
                                  <UpdateUserRoleForm
                                    refetchUsers={refetch}
                                    role={user.role!}
                                    userId={user.id}
                                  />
                                </DialogContent>
                              </Dialog>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <UpdateUserActiveDialog
                                  dataId={user.id}
                                  status={user.active}
                                  handleUpdateActiveStatus={
                                    updateUserActiveStatus
                                  }
                                  mutationLoading={isUserActiveStatusUpdating}
                                  isSuccess={isUserActiveStatusUpdated}
                                  refetch={refetch}
                                >
                                  <div
                                    className={cn(
                                      "flex items-center gap-2 px-1 cursor-pointer",
                                      user.active
                                        ? "text-amber-600"
                                        : "text-cyan-600"
                                    )}
                                  >
                                    <SquaresIntersect
                                      className={cn(
                                        "size-4 text-destructive",
                                        user.active
                                          ? "text-amber-600"
                                          : "text-cyan-600"
                                      )}
                                    />
                                    <span className="text-sm">
                                      {user.active ? "Deactivate" : "Activate"}{" "}
                                      user
                                    </span>
                                  </div>
                                </UpdateUserActiveDialog>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <DeleteDialog
                                  dataId={user.id}
                                  title={`user ${user.name}`}
                                  handleDelete={deleteMutation}
                                  mutationLoading={isDeleting}
                                  isSuccess={isDeleteSuccess}
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
                      )}
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

export default UserComponent;
