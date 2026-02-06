"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { Loader2 } from "lucide-react";
import BlogCard from "../../../_components/blog-card";
import Link from "next/link";

const CategoryPage = ({ slug }: { slug: string }) => {
  const trpc = useTRPC();

  const { data: category, isLoading, isError } = useQuery(
    trpc.getBlogCategoryBySlug.queryOptions({ slug: `/${slug}` })
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[240px]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="flex items-center justify-center min-h-[240px]">
        <p className="text-lg">Category not found.</p>
      </div>
    );
  }

  const posts = (category.blogs || []).filter((b: any) => b.status === "PUBLISHED").sort((a: any, b: any) => {
    const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return db - da;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <header className="mb-6">
        <nav className="text-sm text-gray-500 mb-2">
          <Link href="/blogs" className="hover:underline">
            Blogs
          </Link>
          <span className="px-2">/</span>
          <span className="font-medium">{category.name}</span>
        </nav>

        <h1 className="text-3xl font-bold">{category.name}</h1>
        {/* {category.description && (
          <p className="text-gray-600 mt-2">{category.description}</p>
        )} */}
        <div className="text-sm text-gray-500 mt-1">{posts.length} posts</div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {posts.length === 0 && (
          <div className="p-6 text-center text-gray-500">No posts in this category yet.</div>
        )}

        {posts.map((post: any) => (
          <article key={post.id} className="bg-background border rounded-lg p-4">
              <BlogCard blog={post} textSize={40} />
          </article>
        ))}
      </section>
    </div>
  );
};

export default CategoryPage;
