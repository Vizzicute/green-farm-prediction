"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2 w-1/2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Overview cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-6 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-24 rounded" />
                <Skeleton className="h-3 w-40" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed stats skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Subscription */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-4 w-36" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-4 w-36" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-4 w-36" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predictions */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              <Skeleton className="h-4 w-36" />
            </CardTitle>
            <Skeleton className="h-8 w-36" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>

              <div className="pt-2">
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <Skeleton className="h-2 w-1/3 rounded-full" />
                </div>
                <Skeleton className="h-3 w-20 mt-2 mx-auto" />
              </div>

              <div className="text-xs text-muted-foreground text-center">
                <Skeleton className="h-3 w-48 mx-auto" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
