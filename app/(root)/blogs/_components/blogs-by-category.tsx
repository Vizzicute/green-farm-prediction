import { cn } from "@/lib/utils";
import BlogHeadingTextWrapper from "./blog-heading-text-wrapper";
import { truncate } from "@/utils/truncate";
import { format } from "date-fns";
import BlogCard from "./blog-card";
import Link from "next/link";
import { BlogCategory } from "@/types";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useJSONToHTML } from "@/hooks/use-json-to-html";

interface BlogsByCategoryProps {
  blogCategories: BlogCategory[];
  loading: boolean;
  className?: string;
  blogCategoryName: string;
}

const BlogsByCategory = ({
  blogCategories,
  loading,
  className,
  blogCategoryName,
}: BlogsByCategoryProps) => {
  const blogCategory = blogCategories.find(
    (category) => category.name === blogCategoryName
  );

  const publishedBlog = blogCategory?.blogs ? blogCategory?.blogs.filter(
    (blog) => blog.status === "PUBLISHED"
  ) : [];

  const mostRecentBlog = publishedBlog[0];
  const secondMostRecentBlog = publishedBlog[1];
  const thirdMostRecentBlog = publishedBlog[2];
  const fourthMostRecentBlog = publishedBlog[3];
  const fifthMostRecentBlog = publishedBlog[4];

    const contentJSON = mostRecentBlog ? JSON.parse(mostRecentBlog.content) : {};
    const contentHTML = useJSONToHTML(contentJSON).replace(/<[^>]*>?/g, "");

  return (
    blogCategory?.blogs && blogCategory.blogs.length > 0 && (
      <div className={cn("w-full flex flex-col gap-4", className)}>
        <Link
          className="hover:underline"
          href={"/blogs/category/" + blogCategoryName}
        >
          <BlogHeadingTextWrapper
            text={blogCategory?.name}
            bgColor="bg-primary"
            textColor="text-secondary"
          />
        </Link>
        <div className="w-full flex flex-row gap-4">
          <div className="w-1/2 flex flex-col gap-4">
            <img
              src={useConstructUrl(mostRecentBlog?.featuredImage ?? "")}
              alt={mostRecentBlog?.title}
              className="w-full h-1/2 object-cover"
            />
            <div className="w-full flex flex-col gap-4">
              <h1 className="text-xl font-semibold">
                {truncate(mostRecentBlog?.title, 40)}
              </h1>
              <span className="text-[10px] text-gray-500">
                {process.env.NEXT_PUBLIC_APP_SHORT_TITLE} ••{" "}
                {mostRecentBlog?.createdAt
                  ? format(new Date(mostRecentBlog.createdAt), "MMMM d, yyyy")
                  : format(new Date(), "MMMM d, yyyy")}
              </span>
              <p className="text-[12px] text-gray-500">
                {truncate(contentHTML, 100)}
              </p>
            </div>
          </div>
          <div className="w-1/2 flex flex-col gap-4">
            {[
              secondMostRecentBlog,
              thirdMostRecentBlog,
              fourthMostRecentBlog,
              fifthMostRecentBlog,
            ]
              .filter((blog) => blog !== undefined)
              .map((blog) => (
                <BlogCard key={blog.id} blog={blog} textSize={23} />
              ))}
          </div>
        </div>
      </div>
    )
  );
};

export default BlogsByCategory;