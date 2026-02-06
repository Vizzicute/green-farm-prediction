import React, { ReactNode } from "react";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";

interface Props extends ButtonProps {
  loading: boolean;
  children?: ReactNode;
  className?: string;
}

const LoadingButton = ({ loading, children, className, ...props }: Props) => {
  return (
    <Button disabled={loading} className={cn(className)} {...props}>
      {loading && <Spinner />} {children}
    </Button>
  );
};

export default LoadingButton;
