"use client";

import LoadingButton from "@/components/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/better-auth/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const loginWithGoogleMutation = useMutation({
    mutationFn: async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signing in with Google, Redirecting...");
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    },
  });

  const loginWithEmailMutation = useMutation({
    mutationFn: async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email sent to your inbox, Redirecting...");
            router.push(`/verify-request?email=${email}`);
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
      <LoadingButton
        loading={loginWithGoogleMutation.isPending}
        onClick={() => loginWithGoogleMutation.mutateAsync()}
        className="w-full"
        variant={"outline"}
      >
        <img src={"/google.png"} className="size-6 rounded-full object-cover" />
        Log in with Google
      </LoadingButton>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-card px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>

      <div className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="abc@gmail.com"
            autoComplete="email"
            required
          />
        </div>

        <LoadingButton
          loading={loginWithEmailMutation.isPending}
          onClick={() => loginWithEmailMutation.mutateAsync()}
        >
          Continue with Email
        </LoadingButton>
      </div>
    </>
  );
};

export default LoginForm;
