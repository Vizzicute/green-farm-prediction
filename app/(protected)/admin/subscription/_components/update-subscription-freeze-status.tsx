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
  handleUpdateFreezedStatus: (input: { id: string, isFreezed: boolean}) => void;
  mutationLoading: boolean;
  isFreezed: boolean;
  isSuccess: boolean;
  refetch: () => void;
}

const UpdateSubscriptionFreezeStatusDialog = ({
  children,
  dataId,
  handleUpdateFreezedStatus,
  mutationLoading,
  isFreezed,
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
      `subscription ${status ? "deactivated" : "activated"} successfully!`
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
            Are you sure you want to {isFreezed ? "Unfreeze" : "Freeze"} this
            subscription ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Click Cancel if you are unsure.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            variant={isFreezed ? "default" : "destructive"}
            loading={mutationLoading}
            onClick={() =>
              handleUpdateFreezedStatus({ id: dataId, isFreezed: !isFreezed })
            }
          >
            {isFreezed ? "Unfreeze" : "Freeze"}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateSubscriptionFreezeStatusDialog;
