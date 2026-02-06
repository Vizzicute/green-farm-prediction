"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import BlogCard from "../../_components/blog-card";

const CategoryComponents = () => {
  const trpc = useTRPC();

  const {
    data: categories,
    isLoading: catsLoading,
    isError: catsError,
  } = useQuery(trpc.getBlogCategories.queryOptions());

  if (catsLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (catsError) {
    return <div className="p-6 text-red-600">Failed to load categories.</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Blog Categories</h1>

      <div className="w-full">
        <div className="grid gap-6 md:grid-cols-2">
          {categories?.map((c: any) => (
            <section
              key={c.id}
              className="bg-background border rounded-lg shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{c.name}</h2>
                <span className="text-sm text-gray-600">{c.blogs?.length || 0} posts</span>
              </div>
              {c.description && (
                <p className="text-sm text-gray-500 mt-2">{c.description}</p>
              )}

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {c.blogs && c.blogs.length > 0 ? (
                  c.blogs.slice(0, 4).map((blog: any) => (
                    <div key={blog.id} className="flex items-start gap-3">
                      <BlogCard blog={blog} textSize={40} />
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400">No posts in this category.</div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-end">
                <Link
                  href={`/blogs/category${c.slug}`}
                  className="text-primary hover:underline text-sm"
                >
                  View all
                </Link>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryComponents;
