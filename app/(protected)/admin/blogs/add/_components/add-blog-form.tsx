"use client";

import Uploader from "@/components/file-uploader/uploader";
import LoadingButton from "@/components/loading-button";
import { TextEditor } from "@/components/text-editor/editor";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BlogStatus } from "@/generated/prisma";
import { useSession } from "@/hooks/use-session";
import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { blogSchema, blogSchemaType } from "@/schema/blog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";

const AddBlogForm = () => {
  const trpc = useTRPC();
  const session = useSession();
    const userId = session.data?.user?.id;

  const [status, setStatus] = useState("PUBLISHED");

  const { mutate, isPending } = useMutation(
    trpc.adminCreateBlog.mutationOptions()
  );

  const { data: blogCategories, isLoading } = useQuery(
    trpc.adminGetBlogCategories.queryOptions()
  );

  const resolver = zodResolver(
    blogSchema
  ) as unknown as Resolver<blogSchemaType>;

  const form = useForm<blogSchemaType>({
    resolver,
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      status: "DRAFT",
      featuredImage: "",
      publishedAt: new Date().toDateString(),
      authorId: "",
      categoriesId: [],
    },
  });

      useEffect(() => {
        if(!userId) return;
        form.setValue("authorId", userId);
      }, [userId]);

  async function onSubmit(data: blogSchemaType) {
    data.slug = slugify(data.title, { lower: true, strict: true });
    status !== "SCHEDULED" && (data.publishedAt = new Date().toDateString());
    mutate(
      { ...data },
      {
        onSuccess: (data: { status: number; message: string }) => {
          if (data.status === 500) {
            toast.error(data.message);
          }
          toast.success(data.message);
          form.reset();
        },
          onError: (error) => {
            console.error(error);
          toast.error(error.message);
        },
      }
    );
  }
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
          name="content"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Content</FormLabel>
              <FormControl>
                <TextEditor field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoriesId"
          render={({ field }) => {
            const [open, setOpen] = useState(false);

            const handleCategoryChange = useCallback(
              (itemId: string) => {
                const currentValue = field.value || [];
                const newValue = currentValue.includes(itemId)
                  ? currentValue.filter((id) => id !== itemId)
                  : [...currentValue, itemId];
                field.onChange(newValue);
              },
              [field]
            );

            return (
              <FormItem className="w-full">
                <FormLabel>Categories</FormLabel>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        {field.value?.filter(Boolean).length > 0
                          ? field.value
                              .map(
                                (id) =>
                                  blogCategories?.find((item) => item.id === id)
                                    ?.name
                              )
                              .filter(Boolean)
                              .join(", ")
                          : "Select Blog Categories"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search categories..." />
                        <CommandList>
                          <CommandGroup>
                            {isLoading ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              blogCategories?.map((item) => (
                                <CommandItem
                                  key={item.id}
                                  onSelect={() => handleCategoryChange(item.id)}
                                  className="flex items-center justify-between"
                                >
                                  <span>{item.name}</span>
                                  <div
                                    role="checkbox"
                                    aria-checked={field.value?.includes(
                                      item.id
                                    )}
                                    className={cn(
                                      "size-4 rounded border border-primary",
                                      field.value?.includes(item.id) &&
                                        "bg-primary"
                                    )}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleCategoryChange(item.id);
                                    }}
                                  >
                                    {field.value?.includes(item.id) && (
                                      <Check className="size-4" />
                                    )}
                                  </div>
                                </CommandItem>
                              ))
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="featuredImage"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Featured Image</FormLabel>
              <FormControl>
                <Uploader value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex justify-between items-center p-2 mt-3">
          <div className="flex flex-col gap-1">
            <span className="md:text-lg text-sm font-semibold">
              Submit Blog Post As:
            </span>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full md:mt-2">
                  <FormControl>
                    <div className="w-full flex flex-col gap-2">
                      <RadioGroup
                        defaultValue={field.value}
                        onValueChange={(val) => {
                          form.setValue("status", val as BlogStatus);
                          setStatus(val);
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            className="border-1 border-primary"
                            value="DRAFT"
                            id="r1"
                          />
                          <Label htmlFor="r1">Draft</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            className="border-1 border-primary"
                            value="PUBLISHED"
                            id="r2"
                          />
                          <Label htmlFor="r2">Publish</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            className="border-1 border-primary"
                            value="SCHEDULED"
                            id="r3"
                          />
                          <Label htmlFor="r3">Schedule Publish</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row p-2 gap-2 items-center">
            {status === "SCHEDULED" && (
              <FormField
                control={form.control}
                name="publishedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        placeholder="Date And Time"
                        className="w-full bg-slate-100 rounded-none border-gray-500 border-0 border-b-1 focus-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <LoadingButton loading={isPending} type="submit">
              {status === "DRAFT"
                ? "Save as Draft"
                : status === "SCHEDULED"
                  ? "Schedule Publish"
                  : "Publish"}
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AddBlogForm;
