"use client";

import React, { useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import { useTRPC } from "@/lib/trpc/client";
import { usePathname } from "next/navigation";
import { NotificationType } from "@/generated/prisma";
import LoadingButton from "@/components/loading-button";

interface NotificationsDropdownProps {
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    | "secondary"
    | null
    | undefined;
  className?: string;
}

export default function NotificationsDropdown({
  variant,
  className,
}: NotificationsDropdownProps) {
  const trpc = useTRPC();
  const { data: userSession } = useSession();
  const pathname = usePathname();

  const {
    data: notifications,
    isLoading,
    refetch,
  } = useQuery(
    trpc.getNotifications.queryOptions({
      id: userSession ? userSession.user.id : "",
      page: 1,
      pageSize: 10,
    })
  );

  const { mutate: markAsReadMutation, isSuccess: marked } = useMutation(
    trpc.markNotificationAsRead.mutationOptions()
  );

  const {
    mutate: markAllAsReadMutation,
    isPending: isMarkingAll,
    isSuccess: markedAll,
  } = useMutation(trpc.markAllAsReadMutation.mutationOptions());

  const { data: unreadCount, refetch: refetchCount } = useQuery(
    trpc.getUnreadNotificationsCount.queryOptions({
      id: userSession ? userSession.user.id : "",
    })
  );

  useEffect(() => {
    if (marked || markedAll) {
      refetch();
      refetchCount();
    }
  }, [marked, markedAll]);

  const handleNotificationClick = (id: string) => {
    markAsReadMutation({ id });
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "NEW_COMMENT":
        return "💬";
      case "NEW_SUBSCRIPTION":
        return "💳";
      case "NEW_USER":
        return "👤";
      case "EXPIRED_SUBSCRIPTION":
        return "⚠️";
      default:
        return "📢";
    }
  };

  const getTitle = (type: NotificationType) => {
    switch (type) {
      case "NEW_COMMENT":
        return "New Comment";
      case "NEW_SUBSCRIPTION":
        return "New Subscription";
      case "NEW_USER":
        return "New User Registration";
      case "EXPIRED_SUBSCRIPTION":
        return "Subscription expired";
      default:
        return "📢";
    }
  };

  const getNotificationLink = (type: string) => {
    switch (type) {
      case "new_comment":
        return "/admin/blog?tab=comments";
      case "new_subscription":
        return "/admin/users?tab=subscriptions";
      case "new_user":
        return "/admin/users";
      case "subscription_expiring":
        return "/admin/users?tab=subscriptions";
      case "payment_received":
        return "/admin/payments";
      case "prediction_result":
        return "/admin/predictions";
      case "staff_assignment":
        return "/admin/staff";
      default:
        return "#";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          className={cn("relative", className)}
        >
          <Bell className="size-5" />
          {(unreadCount ?? 0) > 0 && (
            <span className="absolute top-1 right-1 size-3 bg-red-500 rounded-full text-white text-[8px] text-center">
              {(unreadCount ?? 0).toString()}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {(unreadCount ?? 0) > 0 && (
            <LoadingButton
              loading={isMarkingAll}
              variant="ghost"
              size="sm"
              onClick={() => markAllAsReadMutation()}
              className="text-xs"
            >
              Mark all as read
            </LoadingButton>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications?.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications?.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start p-4 cursor-pointer",
                  !notification.read && "bg-muted"
                )}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{getTitle(notification.type)}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(
                        new Date(notification.createdAt),
                        "MMM d, h:mm a"
                      )}{" "}
                      {pathname.includes("/admin") && (
                        <Link
                          href={`${getNotificationLink(notification.type)}`}
                          className="text-blue-400 hover:underline"
                        >
                          View {getTitle(notification.type)}
                        </Link>
                      )}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
