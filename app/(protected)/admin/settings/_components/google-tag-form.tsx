"use client";

import LoadingButton from "@/components/loading-button";
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
import { GoogleTagSettings, googleTagSettingsSchema } from "@/schema/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const GoogleTagForm = () => {
  const trpc = useTRPC();

  const { mutate, isPending } = useMutation(
    trpc.adminUpdateSettings.mutationOptions()
  );

  const { data: googleTags, refetch } = useQuery(
    trpc.adminGetSettingsByCategory.queryOptions({ category: "google-tags" })
  );

  const form = useForm<GoogleTagSettings>({
    resolver: zodResolver(googleTagSettingsSchema),
    defaultValues: {
      gaMeasurementId: "",
      gtmId: "",
      adsenseId: "",
    },
  });

  useEffect(() => {
    if (!googleTags) return;
    form.reset(JSON.parse(googleTags.value) as GoogleTagSettings);
  }, [googleTags]);

  function onSubmit(data: GoogleTagSettings) {
    const value = JSON.stringify(data);
    mutate(
      { id: googleTags!.id, value },
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
          name="gaMeasurementId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GA Measurement ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gtmId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GTM ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="adsenseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adsense ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton loading={isPending} type="submit" className="w-full">
          Save Google Tag Settings
        </LoadingButton>
      </form>
    </Form>
  );
};

export default GoogleTagForm;
