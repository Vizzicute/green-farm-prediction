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

interface iComProps {
  children: ReactNode;
  dataId: string;
  handleUpdateActiveStatus: (input: { id: string, active: boolean}) => void;
  mutationLoading: boolean;
  status: boolean;
  isSuccess: boolean;
  refetch: () => void;
}

const UpdateUserActiveDialog = ({
  children,
  dataId,
  handleUpdateActiveStatus,
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
    toast.success(`user ${status ? "deactivated" : "activated"} successfully!`);
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
            Are you sure you want to {status ? "deactivate" : "activate"} this
            user ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Click Cancel if you are unsure.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            variant={ status ? "destructive" : "default"}
            loading={mutationLoading}
            onClick={() => handleUpdateActiveStatus({ id: dataId, active: !status})}
          >
            {status ? "Deactivate" : "Activate"}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateUserActiveDialog;
