"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import SubscribersTab from "./subscribers-tab";
import CategoriesTab from "./categories-tab";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateSubscriberForm from "./create-subscriber-form";
import CreateCategoryForm from "./create-category-form";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import CommentsTab from "./comments-tab";

const TabView = () => {
    const trpc = useTRPC();
    const router = useRouter();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab") || "subscribers";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const filters = {} as any;

  
    const { data: categories, isLoading: isCategoriesLoading, refetch: refetchCategories } = useQuery(
      trpc.adminGetSubscriptionCategories.queryOptions()
  );
  const {
      refetch,
    } = useQuery(
      trpc.adminGetSubscriptions.queryOptions({
        filters,
        currentPage: 1,
        pageSize: 20,
      })
    );
  return (
    <div className="space-y-6">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {tab === "subscribers" ? "Subscribers" : "Subscription Categories"}
        </h1>
        <Dialog modal={false}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              {tab === "subscribers"
                ? "Add New Subscriber"
                : "Add New Category"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {tab === "subscribers"
                  ? "Add New Subscriber"
                  : "Add New Subscription Category"}
              </DialogTitle>
            </DialogHeader>
            {tab === "subscribers" ? (
              <CreateSubscriberForm refetchSubscribers={refetch} />
            ) : (
              <CreateCategoryForm refetch={refetchCategories} />
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Tabs
        value={tab}
        onValueChange={handleTabChange}
        className="w-full flex items-center justify-center space-y-2"
      >
        <TabsList className="w-2/3">
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="comments">Subscriber Comments</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="subscribers" className="w-full">
          <SubscribersTab />
        </TabsContent>
        <TabsContent value="comments" className="w-full">
          <CommentsTab />
        </TabsContent>
        <TabsContent value="categories" className="w-full">
          <CategoriesTab
            refetch={refetchCategories}
            categories={categories}
            isLoading={isCategoriesLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabView;
