"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/lib/trpc/client";
import { env } from "@/schema/env";
import { useQuery } from "@tanstack/react-query";
import { Edit3 } from "lucide-react";
import Link from "next/link";
import React from "react";

const PageComponents = () => {
    const trpc = useTRPC();

    const { data: pages, isLoading, refetch } = useQuery(trpc.adminGetPagesData.queryOptions());

  return (
    <Card className="w-full">
      <CardContent>
        <div className="rounded-md border">
          {isLoading ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500 animate-pulse">
                Loading Pages...
              </h3>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="text-center">
                  <TableHead className="text-center">S/N</TableHead>
                  <TableHead className="text-center">Title</TableHead>
                  <TableHead className="text-center">Url</TableHead>
                  <TableHead className="text-center">Last Updated At</TableHead>
                  <TableHead className="text-center">Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages?.map((page, index) => (
                  <TableRow key={page.id} className="text-center">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{page.title}</TableCell>
                    <TableCell>
                      <Link href={`/${page.slug}`}>
                        {env.NEXT_PUBLIC_APP_URL}{page.slug}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {new Date(page.updatedAt).toDateString()}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/pages/${page.id}/edit`} className="flex items-center justify-center">
                        <Edit3 className="size-4" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PageComponents;
