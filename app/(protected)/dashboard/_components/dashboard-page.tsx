"use client";

import React, { useState } from "react";
import { useSession } from "@/hooks/use-session";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import SubscriptionCounter from "../../../(root)/_components/subscription-counter";
import BlogSection from "../../../(root)/_components/blog-section";
import PredictionCard from "../../../(root)/_components/prediction-card";
import NotificationsDropdown from "../../admin/_components/notification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { dateString, formattedDate } from "@/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { isAfter } from "date-fns";
import LogoutButton from "@/components/logout-button";
import ThemeToggler from "@/components/theme-toggler";
import ProfileForm from "./profile-form";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";

const DashboardPage = () => {
  const trpc = useTRPC();
  const isMobile = useIsMobile();

  const [customDate, setCustomDate] = useState<Date>(new Date());

  const { data: session, refetch } = useSession();
  const userId = session?.user?.id ?? "";

  const { data: subscriptions, isLoading: isSubscriptionLoading } = useQuery(
    trpc.getUserSubscriptions.queryOptions({
      userId,
      predictionFilters: {
        customStartDate: formattedDate(customDate),
        customEndDate: formattedDate(customDate),
      },
    })
  );

  const isSubscribed = subscriptions?.some((s: any) => s.isActive === true);

  // Comments: fetch user's subscription comments (search by email)
  const {
    data: userComments,
    isLoading: isCommentsLoading,
    refetch: refetchComments,
  } = useQuery(
    trpc.adminGetComments.queryOptions({
      type: "SUBSCRIPTION",
      filters: { search: session?.user?.email ?? "" },
      pageNumber: 1,
      pageSize: 10,
    })
  );

  const { data: blogs } = useQuery(
    trpc.getBlogPosts.queryOptions({
      filters: { status: "PUBLISHED" },
      page: 1,
      pageSize: 1,
    })
  );

  const { mutate: addComment, isPending: isAddingComment } = useMutation(
    trpc.addComment.mutationOptions()
  );

  const { mutate: notifyNewSubscription, isPending: isNotifying } = useMutation(
      trpc.newNotification.mutationOptions()
    );

  const [subscriptionComment, setSubscriptionComment] = useState("");

  const handleAddSubscriptionComment = () => {
    if (!subscriptionComment.trim()) return;
    const fallbackBlogId = blogs && blogs.length > 0 ? blogs[0].id : "";
    if (!fallbackBlogId) {
      toast.error("Cannot post comment right now. Try again later.");
      return;
    }
    addComment(
      {
        blogId: fallbackBlogId,
        userId: session?.user?.id,
        type: "SUBSCRIPTION",
        content: subscriptionComment,
      },
      {
        onSuccess: () => {
          notifyNewSubscription({
            type: "NEW_COMMENT",
            userId: session?.user?.id ?? "",
            message: `${session?.user?.name ?? "You"} Added a new comment on subscription.`,
          });
          setSubscriptionComment("");
          toast.success("Comment submitted");
        },
      }
    );
  };

  const { data: bankerPredictions, isLoading: isBankerLoading } = useQuery(
    trpc.getPredictions.queryOptions({
      filters: {
        banker: true,
        customStartDate: formattedDate(customDate),
        customEndDate: formattedDate(customDate),
      },
      currentPage: 1,
      pageSize: 6,
    })
  );

  // profile edit handled by `ProfileForm` which calls TRPC `updateProfile`

  return (
    <div className="w-full p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <ThemeToggler />
          <NotificationsDropdown variant={"outline"} />
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-13 gap-4">
        <aside className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <Avatar>
                  <AvatarImage src={session?.user?.image ?? undefined} />
                  <AvatarFallback>
                    {session?.user?.name?.charAt(0) ?? "G"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="font-semibold">{session?.user?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {session?.user?.email}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Joined:{" "}
                    {session?.user?.createdAt
                      ? new Date(session.user.createdAt).toLocaleDateString()
                      : "-"}
                  </div>
                  <div
                    className={`mt-2 text-sm font-medium ${isSubscribed ? "text-green-600" : "text-amber-600"}`}
                  >
                    {isSubscribed
                      ? "Subscription: Active"
                      : "Subscription: Inactive"}
                  </div>
                </div>

                <div className="w-full flex gap-2">
                  {isMobile ? (
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="outline" className="w-full">
                          Edit Profile
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Edit Profile</DrawerTitle>
                        </DrawerHeader>
                        <div className="h-[1/2dvh] overflow-y-scroll pb-6 px-2">
                          {session && session.user && (
                            <ProfileForm
                              user={{
                                id: session.user.id,
                                name: session.user.name,
                                email: session.user.email,
                                image: session.user.image,
                              }}
                              refetch={refetch}
                            />
                          )}
                        </div>
                      </DrawerContent>
                    </Drawer>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">Edit Profile</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        {session && session.user && (
                          <ProfileForm
                            user={{
                              id: session.user.id,
                              name: session.user.name ?? "",
                              email: session.user.email ?? "",
                              image: session.user.image ?? null,
                            }}
                            refetch={refetch}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {!isMobile &&
            subscriptions?.length === 0 &&
            !isSubscriptionLoading && (
              <div className="mt-4">
                <SubscriptionCounter />
              </div>
            )}
        </aside>

        <main className="lg:col-span-7">
          <section className="w-full">
            <h2 className="text-xl font-semibold mb-2">Predictions</h2>
            <div className="w-full flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center justify-center gap-4 md:gap-6">
                <Button
                  variant={"outline"}
                  onClick={() =>
                    setCustomDate((d) => {
                      if (!d) return d;
                      const next = new Date(d);
                      next.setDate(next.getDate() - 1);
                      return next;
                    })
                  }
                >
                  Previous Day
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("justify-start text-left font-normal")}
                    >
                      <CalendarIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      required={true}
                      selected={customDate}
                      onSelect={setCustomDate}
                    />
                  </PopoverContent>
                </Popover>
                <Button
                  variant={"outline"}
                  onClick={() =>
                    setCustomDate((d) => {
                      if (!d) return d;
                      const next = new Date(d);
                      next.setDate(next.getDate() + 1);
                      return next;
                    })
                  }
                >
                  Next Day
                </Button>
              </div>
              {isSubscriptionLoading || isBankerLoading ? (
                <div className="flex items-center justify-center gap-1">
                  <Loader2 className="size-4 animate-spin" />{" "}
                  <span className="animate-pulse">Loading Predictions...</span>
                </div>
              ) : subscriptions && subscriptions.length !== 0 ? (
                subscriptions.map((subscription) => (
                  <div key={subscription.id} className="w-full mb-4">
                    <h3 className="text-center">
                      {subscription.SubscriptionCategory?.name ?? ""} -{" "}
                      {dateString(customDate)}
                    </h3>
                    <div className="w-full flex flex-row flex-wrap items-center justify-center gap-2 p-4">
                      {subscription.isFreezed ? (
                        <span className="font-semibold text-amber-600">
                          Subscription is currently freezed!.
                        </span>
                      ) : subscription.SubscriptionCategory?.predictions.length ===
                      0 ? (
                        <span className="font-semibold">
                          {isAfter(customDate, new Date())
                            ? "No Prediction Yet!"
                            : "No Prediction Added!"}
                        </span>
                      ) : (
                        subscription.SubscriptionCategory?.predictions.map(
                          (prediction) => (
                            <PredictionCard
                              key={prediction.id}
                              prediction={{
                                ...prediction,
                                SubscriptionCategory:
                                  subscription.SubscriptionCategory,
                              }}
                            />
                          )
                        )
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <h3 className="text-center">
                    Banker Bet - {dateString(customDate)}
                  </h3>
                  <div className="w-full flex flex-row flex-wrap items-center justify-center gap-2 p-4">
                    {bankerPredictions !== undefined &&
                    bankerPredictions.length === 0 ? (
                      <span className="font-semibold">
                        {isAfter(customDate, new Date())
                          ? "No Prediction Yet!"
                          : "No Prediction Added!"}
                      </span>
                    ) : (
                      bankerPredictions?.map((prediction) => (
                        <PredictionCard
                          key={prediction.id}
                          prediction={prediction}
                        />
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </section>

          {isMobile &&
            subscriptions?.length === 0 &&
            !isSubscriptionLoading && (
              <div className="mt-4">
                <SubscriptionCounter />
              </div>
            )}

          <section className="mt-6">
            <BlogSection />
          </section>
        </main>

        <aside className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Your Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="w-full">
                <div className="flex flex-col justify-center items-center space-y-2">
                  <label className="text-sm font-medium">
                    Add Comment about your subscription
                  </label>
                  <Textarea
                    value={subscriptionComment}
                    onChange={(e) => setSubscriptionComment(e.target.value)}
                    className="w-full"
                    placeholder="Share feedback regarding your subscription"
                    rows={3}
                  />
                      <Button
                        onClick={handleAddSubscriptionComment}
                        disabled={isAddingComment}
                        className="w-full"
                      >
                        {isAddingComment ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          "Post Comment"
                        )}
                      </Button>
                  
                </div>

                <div className="mt-4 space-y-2">
                  {isCommentsLoading ? (
                    <div className="text-sm text-muted-foreground">
                      Loading comments...
                    </div>
                  ) : userComments && userComments.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No comments yet.
                    </div>
                  ) : (
                    userComments?.map((c: any) => (
                      <div key={c.id} className="p-2 border rounded-md">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">
                            You
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(c.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-sm">{c.content}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;
