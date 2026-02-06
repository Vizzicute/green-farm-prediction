"use client";

import { useTRPC } from '@/lib/trpc/client';
import { blogCategorySchema, blogCategorySchemaType } from '@/schema/blog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import slugify from "slugify"
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LoadingButton from '@/components/loading-button';

interface iComProps {
    refetch: () => void;
    category: {
        id: string;
        name: string;
        slug: string;
        createdAt: string;
        updatedAt: string;
    };
}

const UpdateBlogCategoryForm = ({ refetch, category }: iComProps) => {
      const trpc = useTRPC();
      const { mutate, isPending } = useMutation(
        trpc.adminUpdateBlogCategory.mutationOptions()
      );
    
      const resolver = zodResolver(
        blogCategorySchema
      ) as unknown as Resolver<blogCategorySchemaType>;
      
      const form = useForm<blogCategorySchemaType>({
        resolver,
        defaultValues: {
            name: category.name,
            slug: category.slug
        },
      });
    
    async function onSubmit(data: blogCategorySchemaType) {
        data.id = category.id;
        data.slug = `/${slugify(data.name)}`;
        mutate(
          { ...data },
          {
            onSuccess: (data: { status: number; message: string }) => {
              if (data.status === 500) {
                toast.error(data.message);
              }
              toast.success(data.message);
              form.reset();
              refetch();
            },
            onError: (error) => {
              toast.error("Something went wrong!");
            },
          }
        );
      }
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Title</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <LoadingButton loading={isPending} type="submit" className="w-full">
              Save Changes
            </LoadingButton>
          </form>
        </Form>
      );
}

export default UpdateBlogCategoryForm
