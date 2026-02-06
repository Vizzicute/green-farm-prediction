import React from "react";
import Link from "next/link";
import { formatDate } from "date-fns";
import { truncate } from "@/utils/truncate";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { BlogStatus } from "@/generated/prisma";

interface iComProps {
  blog: {
    id: string;
    title: string;
    slug: string;
    content: string;
    status: BlogStatus;
    featuredImage: string;
    authorId: string;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  textSize: number;
};

const BlogCard = ({ blog, textSize }: iComProps) => {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="flex flex-row gap-2 items-center justify-center"
    >
      <img
        src={useConstructUrl(blog.featuredImage)}
        alt={blog.title}
        className="w-1/3 h-auto md:h-20 object-cover"
      />
      <div className="flex flex-1 flex-col gap-0">
        <h2 className="text-sm hidden md:block font-normal">
          {truncate(blog.title, 60)}
        </h2>
        <h2 className="text-[12px] block md:hidden py-0 font-normal">
          {truncate(blog.title, textSize)}
        </h2>
        <span className="text-[10px] text-gray-500">
          {formatDate(new Date(blog.createdAt), "MMM dd, yyyy")}
        </span>
      </div>
    </Link>
  );
};

export default BlogCard;
