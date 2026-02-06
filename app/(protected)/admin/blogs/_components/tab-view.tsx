"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CreateBlogCategoryForm from "./create-blog-category-form";
import BlogsTab from "./blogs-tab";
import CategoriesTab from "./categories-tab";
import CommentsTab from "./comments-tab";

const TabView = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab") || "blogs";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const filters = {} as any;

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
  } = useQuery(trpc.adminGetBlogCategories.queryOptions());
  return (
    <div className="space-y-6">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {tab === "blogs" ? "Blogs" : "Blogs Categories"}
        </h1>
        {tab === "blogs" && (
          <Link href={"/admin/blogs/add"} className={cn(buttonVariants())}>
            Add Blog Post
          </Link>
        )}
        {tab == "categories" && (
          <Dialog modal={false}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 size-4" />
                Add Blog Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Blog Category</DialogTitle>
              </DialogHeader>
              <CreateBlogCategoryForm refetch={refetchCategories} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Tabs
        value={tab}
        onValueChange={handleTabChange}
        className="w-full flex items-center justify-center space-y-2"
      >
        <TabsList className="w-2/3">
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="categories">Blog Categories</TabsTrigger>
          <TabsTrigger value="comments">Blog Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="blogs" className="w-full">
          <BlogsTab />
        </TabsContent>
        <TabsContent value="categories" className="w-full">
          <CategoriesTab
            refetch={refetchCategories}
            categories={categories}
            isLoading={isCategoriesLoading}
          />
        </TabsContent>
        <TabsContent value="comments" className="w-full">
          <CommentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabView;
