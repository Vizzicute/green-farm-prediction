"use client";

import React from "react";
import { ButtonProps } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/better-auth/client";
import { useRouter } from "next/navigation";
import LoadingButton from "./loading-button";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

interface iComProps extends ButtonProps {
  className?: string;
  onClick?: () => void;
  text?: boolean;
}

const LogoutButton = ({
  className,
  onClick,
  text = true,
  ...props
}: iComProps) => {
  const router = useRouter();
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/login");
          },
          onError: (error) => {
            toast.error(error.error.message);
            return;
          },
        },
      });
    },
  });
  return (
    <LoadingButton
      loading={logoutMutation.isPending}
      onClick={() => logoutMutation.mutateAsync()}
      className={className}
      {...props}
    >
      <LogOut className="size-4" /> {text ? "Log out" : null}
    </LoadingButton>
  );
};

export default LogoutButton;
