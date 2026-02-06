"use client";

import Uploader from "@/components/file-uploader/uploader";
import LoadingButton from "@/components/loading-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useTRPC } from "@/lib/trpc/client";
import { User, userSchema } from "@/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";

const ProfileForm = ({
  user,
  refetch,
}: {
  user: User;
  refetch: () => void;
}) => {
  const trpc = useTRPC();
  const { mutate, isPending } = useMutation(
    trpc.updateProfile.mutationOptions()
  );

  const resolver = zodResolver(userSchema) as unknown as Resolver<User>;
  const form = useForm<User>({
    resolver,
    defaultValues: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
  });

    useEffect(() => {
        if(!user) return;
        form.reset(user);
    }, [user]);

    async function onSubmit(data: User) {
        if (data.image) {
          // If user.image is already a full URL (e.g. Google), keep it.
          // Otherwise treat it as an S3 key and construct the public URL.
          if (typeof data.image === "string" && data.image.startsWith("http")) {
            // leave as-is
          } else {
            data.image = useConstructUrl(data.image || "");
          }
        } else {
          data.image = null;
        }
    mutate(data, {
      onSuccess: (data: { status: number; message: string }) => {
        if (data.status === 500) {
          toast.error(data.message);
        }
        toast.success(data.message);
        refetch();
      },
      onError: (error) => {
        toast.error("Something went wrong!");
      },
    });
  }
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 flex flex-col justify-center items-center"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Name"
                    className="focus-none border-input rounded-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    className="focus-none border-input rounded-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Profile Image</FormLabel>
                <FormControl>
                  <Uploader value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton loading={isPending} type="submit">
            Save Changes
          </LoadingButton>
        </form>
      </Form>
    );
};

export default ProfileForm;
