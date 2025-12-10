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
import { CommentStatus } from "@/generated/prisma";

interface iComProps {
  children: ReactNode;
  dataId: string;
  handleStatusToggle: (input: { id: string; status: CommentStatus }) => void;
  mutationLoading: boolean;
  status: CommentStatus;
  isSuccess: boolean;
  refetch: () => void;
}

const ToggleCommentStatusForm = ({
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
      `Comment ${status === "APPROVED" ? "Approved" : "Rejected"}!`
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
            {status === "APPROVED"
              ? "Approve"
              : "Reject"}{" "}
            this Comment?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Click Cancel if you are unsure.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            variant={
              status === "APPROVED"
                ? "default"
                : "destructive"
            }
            loading={mutationLoading}
            onClick={() =>
              handleStatusToggle({
                id: dataId,
                status,
              })
            }
          >
            {status === "APPROVED"
              ? "Approve"
              : "Reject"}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ToggleCommentStatusForm;
