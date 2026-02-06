import { MetadataRoute } from "next";
import { getAllPageData } from "./(root)/_server/pagedata";
import { getAllBlogCategories, getAllBlogs } from "./(root)/_server/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getAllBlogs();
  const blogCategories = await getAllBlogCategories();
  const pageData = await getAllPageData();

  const filteredPages = pageData?.filter(
    (page) =>
      page.slug !== "/" &&
      page.slug !== "/privacy" &&
      page.slug !== "/info" &&
      page.slug !== "/about"
  );
  const homepage = pageData?.find((page) => page.slug === "/");

  return [
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      priority: 1,
      lastModified: new Date(homepage?.updatedAt || ""),
    },
    ...(filteredPages?.map((page) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL}${page.slug}`,
      priority: 0.6,
      lastModified: new Date(page.updatedAt || page.createdAt),
    })) || []),
    ...(blogs?.map((blog) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`,
      priority: 0.5,
      lastModified: new Date(blog.updatedAt || blog.createdAt),
    })) || []),
    ...(blogCategories?.map((category) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/category/${category.slug}`,
      priority: 0.5,
      lastModified: new Date(category.updatedAt || category.createdAt),
    })) || []),
  ];
}
