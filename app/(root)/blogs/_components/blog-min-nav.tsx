"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogCategory } from "@/types";

interface BlogMiniNavProps {
  blogCategories: BlogCategory[];
  loading: boolean;
}

const BlogMiniNav = ({ blogCategories, loading }: BlogMiniNavProps) => {
  const pathname = usePathname();

  return (
    <div className="w-fit max-w-full flex flex-row gap-4 p-4">
      <Link
        href="/blogs"
        className={`capitalize font-semibold hover:underline ${
          pathname === "/blogs" && "text-cyan-600"
        }`}
      >
        Home
      </Link>
      {loading ? (
        <Skeleton className="w-full hidden md:flex h-10" />
      ) : (
        blogCategories?.map((category) => (
          <Link
            href={`/blogs/category/${category.slug}`}
            key={category.id}
            className={`hidden md:flex capitalize font-semibold hover:underline ${
              pathname === `/blogs/category/${category.slug}` && "text-cyan-300"
            }`}
          >
            {category.name}
          </Link>
        ))
      )}
    </div>
  );
};

export default BlogMiniNav;
