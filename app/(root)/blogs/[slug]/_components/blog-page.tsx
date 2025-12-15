"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { safeParseTiptapJSON, useJSONToHTML } from "@/hooks/use-json-to-html";
import { useSession } from "@/hooks/use-session";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import React, { useState } from "react";
import parse from "html-react-parser";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import BlogHeadingTextWrapper from "../../_components/blog-heading-text-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BlogCard from "../../_components/blog-card";

const BlogPage = ({ slug }: { slug: string }) => {
  const trpc = useTRPC();
  const { data: userSession } = useSession();

  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const { data: blog, isLoading: loadingBlogPost } = useQuery(
    trpc.getBlogPostBySlug.queryOptions({ slug })
  );

  const contentJSON = safeParseTiptapJSON(blog?.content);
  const outputHtml = useJSONToHTML(contentJSON);

  const { data: blogs, isLoading: loadingBlogPosts } = useQuery(
    trpc.getBlogPosts.queryOptions({
      filters: { status: "PUBLISHED" },
      page: 1,
      pageSize: 15,
    })
  );

  const { mutate: addComment, isPending: isAddingComment } = useMutation(
    trpc.addComment.mutationOptions()
  );

  const { mutate: notifyNewSubscription, isPending: isNotifying } = useMutation(
    trpc.newNotification.mutationOptions()
  );

  const handleAddComment = async () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    if (!userSession && (!guestName.trim() || !guestEmail.trim())) {
      toast.error("Please provide your name and email");
      return;
    }

    try {
      addComment(
        {
          userId: userSession?.user?.id,
          content: comment,
          guestName,
          guestEmail,
          type: "BLOG",
          blogId: blog?.id ?? "",
        },
        {
          onSuccess: () => {
            notifyNewSubscription({
              type: "NEW_COMMENT",
              userId: userSession?.user?.id ?? "",
              message: `${userSession?.user?.name ?? guestName} Commented On Our Blog Post`,
            });
            setComment("");
            setGuestName("");
            setGuestEmail("");
            toast.success("Comment added successfully and is pending approval");
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment");
    }
  };

  if (loadingBlogPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Blog Post not found!</h1>
      </div>
    );
  }

  return (
    <div className="relative container mx-auto py-8 px-2 max-w-4xl">
      <div className="w-full md:w-[65%]">
        <div className="mb-8 px-3">
          <h1 className="text-3xl font-semibold mb-4">{blog.title ?? ""}</h1>
          <div className="flex items-center gap-4 text-gray-600 mb-6 text-sm">
            <span>
              {format(new Date(blog.publishedAt ?? ""), "MMMM d, yyyy")}
            </span>
            <span>••</span>
            {blog &&
              blog.categories?.map((cat, index: number) => (
                <span key={cat.id}>
                  {index > 0 && <span> • </span>}
                  <Link
                    href={`/blog/category/${cat.slug}`}
                    className="hover:text-blue-500"
                  >
                    {cat.name}
                  </Link>
                </span>
              ))}
          </div>
          {blog && blog.featuredImage && (
            <img
              src={useConstructUrl(blog.featuredImage)}
              alt={blog.title}
              className="w-full h-[400px] object-cover rounded-none mb-8"
            />
          )}
        </div>

        {blog && (
          <div className="!w-full !max-w-none p-4 prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert prose-li:marker:text-primary">
            {parse(outputHtml)}
          </div>
        )}

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>

          <div className="mb-8 space-y-4">
            {!userSession && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guestName">Name</Label>
                  <Input
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Your name"
                    className="rounded-[px]"
                  />
                </div>
                <div>
                  <Label htmlFor="guestEmail">Email</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Your email"
                    className="rounded=[px]"
                  />
                </div>
              </div>
            )}
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-4 rounded-[px]"
            />
            <Button
              onClick={handleAddComment}
              disabled={isAddingComment}
              className="min-sm:px-2 max-sm:w-[80%] sm:w-auto rounded-[px]"
            >
              {isAddingComment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Comment...
                </>
              ) : (
                "Post Comment"
              )}
            </Button>
          </div>
        </div>
        <div className="md:hidden flex flex-col gap-4 justify-start">
          <BlogHeadingTextWrapper
            text="Recent Comments"
            bgColor="bg-primary"
            textColor="text-secondary"
          />
          <div className="flex flex-col gap-4">
            <div className="space-y-6">
              {(() => {
                const approvedComments =
                  (blog &&
                    blog.comments?.filter((c) => c.status === "APPROVED")) ||
                  [];
                const latestComments = approvedComments
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .slice(0, 15);

                return latestComments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 items-start">
                    <Avatar>
                      <AvatarImage src={comment.user?.image ?? ""} />
                      <AvatarFallback className="bg-stone-200">
                        {(
                          comment.user?.name ||
                          comment.guestName ||
                          "U"
                        ).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">
                          {comment.user?.name || comment.guestName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(comment.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="text-gray-700 max-w-[200px] flex flex-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ));
              })()}
              {(!blog.comments ||
                blog.comments.filter((c) => c.status === "APPROVED").length ===
                  0) && (
                <p className="text-gray-500 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:flex absolute top-0 right-0 min-h-full md:w-[30%] mt-8 items-start flex-col gap-8 overflow-y-auto">
        <div className="flex flex-col gap-4 justify-start">
          <BlogHeadingTextWrapper
            text="Related Blogs"
            bgColor="bg-primary"
            textColor="text-secondary"
          />
          <div className="flex flex-col gap-4">
            {blog.categories.map((category) => category.blogs?.filter(({id}) => id!== blog?.id).map(() => (
                  <BlogCard key={blog.id} blog={blog} textSize={23} />
            )))}
          </div>
        </div>

        <div className="flex flex-col gap-4 justify-start">
          <BlogHeadingTextWrapper
            text="Recent Comments"
            bgColor="bg-primary"
            textColor="text-secondary"
          />
          <div className="flex flex-col gap-4">
            <div className="space-y-6">
              {(() => {
                const approvedComments =
                  (blog &&
                    blog.comments?.filter((c) => c.status === "APPROVED")) ||
                  [];
                const latestComments = approvedComments
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .slice(0, 7);

                return latestComments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 items-start">
                    <Avatar>
                      <AvatarImage src={comment.user?.image ?? ""} />
                      <AvatarFallback className="bg-stone-200">
                        {(
                          comment.user?.name ||
                          comment.guestName ||
                          "U"
                        ).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">
                          {comment.user?.name || comment.guestName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(comment.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="text-gray-700 max-w-[200px] flex flex-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ));
              })()}
              {(!blog.comments ||
                blog.comments.filter((c) => c.status === "APPROVED").length ===
                  0) && (
                <p className="text-gray-500 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
