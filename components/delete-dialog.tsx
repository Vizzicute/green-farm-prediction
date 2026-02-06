"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import LoadingButton from "./loading-button";
import { toast } from "sonner";

interface iComProps {
  children: ReactNode;
  dataId: string;
  handleDelete: (id: string) => void;
  mutationLoading: boolean;
  title: string;
  isSuccess: boolean;
  refetch: () => void;
}

const DeleteDialog = ({
  children,
  dataId,
  handleDelete,
  mutationLoading,
  title,
  isSuccess,
  refetch,
}: iComProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenDialog = (e: any) => {
    e.preventDefault();
    setTimeout(() => setOpen(true), 10);
  };

  useEffect(() => {
    if (!isSuccess || !open) return;
    toast.success(`${title} deleted successfully!`);
    refetch();
    setOpen(false);
  }, [isSuccess]);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger onChange={(e) => handleOpenDialog(e)} asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this {title}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete this {title}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            variant={"destructive"}
            loading={mutationLoading}
            onClick={() => handleDelete(dataId)}
          >
            Delete
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
