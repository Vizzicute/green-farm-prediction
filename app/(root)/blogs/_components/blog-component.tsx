"use client";

import React from "react";
import BlogMiniNav from "./blog-min-nav";
import BlogHero from "./blog-hero";
import BlogsByCategory from "./blogs-by-category";
import BlogCard from "./blog-card";
import BlogHeadingTextWrapper from "./blog-heading-text-wrapper";
import SocialMediaLinks from "./social-media-links";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";

const BlogComponent = () => {
  const trpc = useTRPC();
  const { data: blogCategories, isLoading } = useQuery(
    trpc.getBlogCategories.queryOptions()
  );

  const { data: blogs } = useQuery(
    trpc.getBlogPosts.queryOptions({
      filters: { status: "PUBLISHED" },
      page: 1,
      pageSize: 100,
    })
  );

  const popularBlogs = blogs
    ?.sort((a, b) => b.comments.length - a.comments.length)
    .slice(0, 7);

  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center px-2 mb-4 max-w-7xl">
      <div className="w-full flex items-center justify-around gap-4">
        {blogCategories && (<BlogMiniNav blogCategories={blogCategories} loading={isLoading} />)}
      </div>
      {blogs && (
        <BlogHero blogs={blogs} loading={isLoading} className="h-100" />
      )}
      <div className="w-full flex md:flex-row flex-col gap-6 mt-4">
        <div className="md:w-2/3 w-full flex flex-col gap-4">
          {blogCategories &&
            blogCategories.map((category) => (
              <BlogsByCategory
                key={category.id}
                blogCategories={blogCategories}
                loading={isLoading}
                blogCategoryName={category.name}
              />
            ))}
        </div>
        <div className="md:w-1/3 w-full flex flex-col gap-4">
          <div className="w-full flex flex-col gap-4">
            <BlogHeadingTextWrapper
              text="Social Media"
              bgColor="bg-primary"
              textColor="text-secondary"
            />
            <div className="w-full flex flex-col gap-4">
              <SocialMediaLinks />
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            <BlogHeadingTextWrapper
              text="Popular Blogs"
              bgColor="bg-primary"
              textColor="text-secondary"
            />
            <div className="w-full hidden md:flex flex-col gap-4">
              {popularBlogs?.map((blog) => (
                <BlogCard key={blog.id} blog={blog} textSize={23} />
              ))}
            </div>
            <div className="w-full flex md:hidden flex-col gap-4">
              {popularBlogs?.map((blog) => (
                <BlogCard key={blog.id} blog={blog} textSize={100} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogComponent;
