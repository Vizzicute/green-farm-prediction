"use client";

import LoadingButton from "@/components/loading-button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/better-auth/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const VerificationForm = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const params = useSearchParams();
  const email = params.get("email") as string;
  const isOtpComplete = otp.length === 6;

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Account verified, Redirecting to dashboard...");
            router.push("/dashboard");
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    },
  });

  return (
    <>
      <div className="flex flex-col items-center space-y-2">
        <InputOTP value={otp} onChange={(value) => setOtp(value)} maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSeparator />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      <LoadingButton
        disabled={!isOtpComplete}
        onClick={() => verifyOtpMutation.mutateAsync()}
        loading={verifyOtpMutation.isPending}
        className="w-full"
      >
        Verify Account
      </LoadingButton>
    </>
  );
};

export default VerificationForm;
