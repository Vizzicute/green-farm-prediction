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
} from "@/components/ui/alert-dialog";
import LoadingButton from "@/components/loading-button";
import { toast } from "sonner";
import { BlogStatus } from "@/generated/prisma";

interface iComProps {
  children: ReactNode;
  dataId: string;
  handleStatusToggle: (input: { id: string; status: BlogStatus }) => void;
  mutationLoading: boolean;
  status: BlogStatus;
  isSuccess: boolean;
  refetch: () => void;
}

const ToggleBlogStatusForm = ({
  children,
  dataId,
  handleStatusToggle,
  mutationLoading,
  status,
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
    toast.success(
      `Blog Posts ${status === "PUBLISHED" ? "Published" : "Archived"} successfully!`
    );
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
            Are you sure you want to{" "}
            {status === "SCHEDULED" ||
            status === "DRAFT" ||
            status === "ARCHIVED"
              ? "Publish"
              : "Archive"}{" "}
            this Blog Post?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Click Cancel if you are unsure.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            variant={
              status === "SCHEDULED" ||
              status === "DRAFT" ||
              status === "ARCHIVED"
                ? "default"
                : "destructive"
            }
            loading={mutationLoading}
            onClick={() =>
              handleStatusToggle({
                id: dataId,
                status:
                  status === "SCHEDULED" ||
                  status === "DRAFT" ||
                  status === "ARCHIVED"
                    ? "PUBLISHED"
                    : "ARCHIVED",
              })
            }
          >
            {status === "SCHEDULED" ||
            status === "DRAFT" ||
            status === "ARCHIVED"
              ? "Publish"
              : "Archive"}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ToggleBlogStatusForm;
