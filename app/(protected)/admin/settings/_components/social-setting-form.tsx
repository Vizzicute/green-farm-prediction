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
import { socialLinksSchema, SocialLinksSettings } from "@/schema/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SocialSettingForm = () => {
  const trpc = useTRPC();

  const { mutate, isPending } = useMutation(
    trpc.adminUpdateSettings.mutationOptions()
  );

  const { data: socialLinks, refetch } = useQuery(
    trpc.adminGetSettingsByCategory.queryOptions({ category: "social" })
  );

  const socialLinksForm = useForm<SocialLinksSettings>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      telegram: "",
      whatsapp: "",
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      supportEmail: "",
      infoEmail: "",
      advertEmail: "",
    },
  });

  useEffect(() => {
    if (!socialLinks) return;
    socialLinksForm.reset(JSON.parse(socialLinks.value) as SocialLinksSettings);
  }, [socialLinks]);

  function onSubmit(data: SocialLinksSettings) {
    const value = JSON.stringify(data);
    mutate(
      { id: socialLinks!.id, value },
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
    <Form {...socialLinksForm}>
      <form
        onSubmit={socialLinksForm.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={socialLinksForm.control}
          name="telegram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telegram Channel</FormLabel>
              <FormControl>
                <Input placeholder="https://t.me/your-channel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={socialLinksForm.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp Link</FormLabel>
              <FormControl>
                <Input placeholder="https://wa.me/your-number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={socialLinksForm.control}
          name="facebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://facebook.com/your-page"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={socialLinksForm.control}
          name="twitter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://twitter.com/your-handle"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={socialLinksForm.control}
          name="instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://instagram.com/your-handle"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={socialLinksForm.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://linkedin.com/company/your-company"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={socialLinksForm.control}
          name="youtube"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://youtube.com/your-channel"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-medium mb-4">Contact Emails</h3>

          <FormField
            control={socialLinksForm.control}
            name="supportEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Support Email</FormLabel>
                <FormControl>
                  <Input placeholder="support@yourdomain.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={socialLinksForm.control}
            name="infoEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Info Email</FormLabel>
                <FormControl>
                  <Input placeholder="info@yourdomain.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={socialLinksForm.control}
            name="advertEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Advertisement Email</FormLabel>
                <FormControl>
                  <Input placeholder="advert@yourdomain.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <LoadingButton loading={isPending} type="submit" className="w-full">
          Save Social Links & Emails
        </LoadingButton>
      </form>
    </Form>
  );
};

export default SocialSettingForm;
