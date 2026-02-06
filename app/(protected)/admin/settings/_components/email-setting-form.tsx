"use client";

import LoadingButton from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/lib/trpc/client";
import { EmailSettings, emailSettingsSchema } from "@/schema/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const EmailSettingForm = () => {
  const trpc = useTRPC();

  const { mutate, isPending } = useMutation(
    trpc.adminUpdateSettings.mutationOptions()
  );

  const { data: email, refetch } = useQuery(
    trpc.adminGetSettingsByCategory.queryOptions({ category: "email" })
    );
    
  const form = useForm<EmailSettings>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpHost: "",
      smtpPort: "",
      smtpUser: "",
      smtpPass: "",
      smtpFrom: "",
    },
  });

    useEffect(() => {
        if (!email) return;
        form.reset(JSON.parse(email.value) as EmailSettings);
    }, [email]);

  function onSubmit(data: EmailSettings) {
    const value = JSON.stringify(data);
    mutate(
      { id: email!.id, value },
      {
        onSuccess: (data: { status: number; message: string }) => {
          if (data.status === 200) {
            toast.success(data.message);
            refetch();
          }

          toast.error(data.message);
        },
        onError: () => {
          toast.error("Something went wrong while updating social settings.");
        },
      }
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="smtpHost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SMTP Host</FormLabel>
              <FormControl>
                <Input placeholder="smtp.gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="smtpPort"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SMTP Port</FormLabel>
              <FormControl>
                <Input placeholder="587" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="smtpUser"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SMTP User Email</FormLabel>
              <FormControl>
                <Input placeholder="your-email@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="smtpPass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SMTP Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter your SMTP password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="smtpFrom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SMTP UserName</FormLabel>
              <FormControl>
                <Input placeholder="noreply@yourdomain.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton loading={isPending} type="submit" className="w-full">
          Save Email Settings
        </LoadingButton>
      </form>
    </Form>
  );
};

export default EmailSettingForm;
