"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Activity, CreditCard, Newspaper, Users } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { useSession } from "@/hooks/use-session";
import { useSubscriptionsMonthlyCount, useUsersMonthlyCount } from "../_hook/use-monthly-count";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const Overview = () => {
  const trpc = useTRPC();
    const { data: currentUser } = useSession();
    const usersPerMonth = useUsersMonthlyCount();
    const subscriptionsPerMonth = useSubscriptionsMonthlyCount();

  const { data: totalUsers, isLoading: isUsersCountLoading } = useQuery(
    trpc.adminGetUsersCount.queryOptions({ filters: { role: "user" } })
  );

  const { data: totalStaff, isLoading: isStaffCountLoading } = useQuery(
    trpc.adminGetUsersCount.queryOptions({ filters: { role: "staff" } })
  );

  const { data: totalSubscribers, isLoading: isSubscribersCountLoading } =
    useQuery(
      trpc.adminGetUsersCount.queryOptions({ filters: { subscription: true } })
    );

  const { data: totalSubscriptions, isLoading: isSubscriptionsCountLoading } =
    useQuery(
      trpc.adminGetSubscriptionsCount.queryOptions({
        filters: { isActive: true, isFreezed: false },
      })
    );

  const { data: totalBlogs, isLoading: isBlogsCountLoading } = useQuery(
    trpc.adminGetBlogPostsCount.queryOptions({
      filters: { status: "PUBLISHED" },
    })
  );

  const { data: recentSubscriptions, isPending: isRecentSubscriptionsLoading } =
    useQuery(
      trpc.adminGetSubscriptions.queryOptions({
        filters: {},
        pageSize: 5,
        currentPage: 1,
      })
    );

  const { data: recentUsers, isLoading: isRecentUsersLoading } = useQuery(
    trpc.adminGetUsers.queryOptions({
      filters: { role: "user" },
      pageSize: 5,
      currentPage: 1,
    })
  );

  const chartData = {
    labels: ["Users", "Staff", "Subscriptions"],
    datasets: [
      {
        data: [totalUsers, totalStaff, totalSubscribers],
        backgroundColor: [
          "rgba(0, 255, 255, 0.85)",
          "rgba(128, 128, 128, 0.85)",
          "rgba(112, 128, 144, 0.85)",
        ],
        borderColor: [
          "rgba(0, 255, 255, 1)",
          "rgba(128, 128, 128, 1)",
          "rgba(112, 128, 144, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "System Statistics",
      },
    },
  };

  if (
    isUsersCountLoading ||
    isSubscriptionsCountLoading ||
    isBlogsCountLoading
  ) {
    return <div>Loading...</div>;
  }

  const stats = [
    {
      title: "Total Subscribers",
      value: totalSubscriptions || 0,
      icon: CreditCard,
      href: "/admin/users?tab=subscriptions",
      color: "text-slate-500",
      bgColor: "bg-slate-100",
    },
    {
      title: "Total Users",
      value: totalUsers || 0,
      icon: Users,
      href: "/admin/users",
      color: "text-cyan-500",
      bgColor: "bg-cyan-100",
    },
    {
      title: "Total Blog Posts",
      value: totalBlogs || 0,
      icon: Newspaper,
      href: "/admin/blog",
      color: "text-amber-500",
      bgColor: "bg-amber-100",
    },
    {
      title: "Total Staff",
      value: totalStaff || 0,
      icon: Activity,
      href: "/admin/staffs",
      color: "text-stone-500",
      bgColor: "bg-stone-100",
    },
  ];

  // Helper to get month labels from last year to now
  function getMonthLabels() {
    const labels = [];
    const now = new Date();
    const start = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1); // next month last year
    for (let i = 0; i < 12; i++) {
      const date = new Date(start.getFullYear(), start.getMonth() + i, 1);
      labels.push(
        date.toLocaleString("default", { month: "short", year: "2-digit" })
      );
    }
    return labels;
  }

  const monthLabels = getMonthLabels();

  const lineChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Users Registered",
        data: usersPerMonth,
        yAxisID: "y-users",
        borderColor: "#64748b",
        backgroundColor: "rgba(100, 116, 139, 0.15)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#64748b",
      },
      {
        label: "Subscriptions",
        data: subscriptionsPerMonth,
        yAxisID: "y-subs",
        borderColor: "#78716c",
        backgroundColor: "rgba(120, 113, 108, 0.15)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#78716c",
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Monthly Users & Subscriptions (Past 12 Months)",
      },
    },
    scales: {
      "y-users": {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: { display: true, text: "Users" },
        beginAtZero: true,
        grid: { drawOnChartArea: false },
      },
      "y-subs": {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: { display: true, text: "Subscriptions" },
        beginAtZero: true,
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Welcome back, {currentUser && currentUser.user?.name}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Statistics Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row items-center justify-between space-x-4">
          <div className="h-[250px] w-fit flex items-center justify-center">
            <Doughnut
              data={chartData}
              options={chartOptions}
              className="w-full"
            />
          </div>
          <div className="h-[350px] flex flex-1 items-center justify-center p-1">
            <Line
              data={lineChartData}
              options={lineChartOptions}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubscriptions?.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">
                      {subscription.User!.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {subscription.duration.split("D")[1]} Days Subscriptions
                    </p>
                  </div>
                  <div className="text-sm font-medium capitalize">
                    {subscription.SubscriptionCategory!.name}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers?.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-sm font-medium capitalize">
                    {user.role}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
