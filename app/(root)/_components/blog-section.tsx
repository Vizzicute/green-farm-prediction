"use client";

import { buttonVariants } from "@/components/ui/button";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useTRPC } from "@/lib/trpc/client";
import { env } from "@/schema/env";
import { customFormatDateText } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, Loader2, User } from "lucide-react";
import Link from "next/link";
import React from "react";

const BlogSection = () => {
  const trpc = useTRPC();

  const { data: blogs, isLoading } = useQuery(
    trpc.getBlogPosts.queryOptions({
      filters: { status: "PUBLISHED" },
      pageSize: 4,
      page: 1,
    })
  );
  return (
    <div className="flex flex-col items-center justify-center bg-secondary/80 space-y-4 py-4">
      <h2 className="text-3xl min-lg:text-4xl font-bold">
        Lastest <span className="text-primary">Blogs</span>
      </h2>
      <p className="text-muted-foreground text-md text-center font-semibold">
        Sport News, Expert tips, strategies, and analysis to improve your
        betting game
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full mx-auto p-2 space-y-3">
        {isLoading ? (
          <div className="animate-pulse">
            <Loader2 className="animate-spin" /> Loading...
          </div>
        ) : (
          blogs &&
          blogs.map((blog) => {
            const image = useConstructUrl(blog.featuredImage);
            return (
              <Link
                key={blog.id}
                href={blog.slug}
                className="relative max-w-sm h-[350px] rounded-2xl overflow-hidden shadow-lg bg-cover bg-center border border-secondary"
                style={{
                  backgroundImage: `url(${image})`,
                }}
              >
                <div className="absolute bottom-0 flex flex-col w-full">
                  <div className="h-[20px] bg-gradient-to-b from-transparent to-background/98 w-full" />
                  <div className="flex flex-col h-[150px] bg-background/98 w-full items-start justify-start p-4 space-y-1">
                    <h2 className="text-lg font-bold leading-snug text-wrap line-clamp-3 truncate">
                      {blog.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      <p className="flex items-center text-center text-sm text-muted-foreground gap-1">
                        <User className="size-3" /> {env.NEXT_PUBLIC_APP_TITLE}
                      </p>
                      <p className="flex items-center text-center text-sm text-muted-foreground gap-1">
                        <Clock className="size-3" />
                        {blog.publishedAt
                          ? customFormatDateText(blog.publishedAt)
                          : "**/**/****"}
                      </p>
                    </div>
                    <p className="flex text-sm text-muted-foreground">
                      Read More <ArrowRight className="size-4" />
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
      <Link
        href={"/blogs"}
        className={buttonVariants({
          variant: "outline",
          className: "px-2 py-1",
        })}
      >
        View All Article
      </Link>
    </div>
  );
};

export default BlogSection;
