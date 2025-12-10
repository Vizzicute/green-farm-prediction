"use client";

import LoadingButton from "@/components/loading-button";
import { TextEditor } from "@/components/text-editor/editor";
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
import { pageDataType, pageDataSchema } from "@/schema/pages-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import React, { useEffect } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const EditPageDataForm = ({ id }: { id: string }) => {
  const trpc = useTRPC();

  const { mutate, isPending } = useMutation(
    trpc.adminUpdatePageData.mutationOptions()
  );

  const {
    data: pageData,
    isLoading: isPageDataLoading,
    refetch,
  } = useQuery(trpc.adminGetPageData.queryOptions({ id }));

  const resolver = zodResolver(
    pageDataSchema
  ) as unknown as Resolver<pageDataType>;

  const form = useForm<pageDataType>({
    resolver,
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      description: "",
      h1tag: "",
    },
  });

  useEffect(() => {
    if (!pageData || isPageDataLoading) return;

    form.reset(pageData);
  }, [pageData, isPageDataLoading]);

  async function onSubmit(data: pageDataType) {
    data.id = pageData?.id;
    mutate(
      { ...data },
      {
        onSuccess: (data: { status: number; message: string }) => {
          if (data.status === 500) {
            toast.error(data.message);
          }
          toast.success(data.message);
          refetch();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  }
  if (!isPageDataLoading && !pageData) return notFound();

  if (isPageDataLoading)
    return (
      <div className="flex justify-center items-center h-[70dvh]">
        <p className="text-lg animate-pulse">Loading...</p>
      </div>
    );
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4 flex flex-col justify-center items-center"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Page Title"
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
          name="slug"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Slug, e.g., /login"
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
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Page Description"
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
          name="h1tag"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="text"
                  placeholder="h1 Content"
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
          name="content"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Page Main Content</FormLabel>
              <FormControl>
                <TextEditor field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex flex-nowrap justify-center">
          <LoadingButton
            loading={isPending}
            type="submit"
            className="uppercase rounded-none"
          >
            Save Changes
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default EditPageDataForm;
