import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import EditBlogForm from "./_components/edit-blog-form";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">Edit Blog Post</h1>
      <Card className="rounded-none">
        <CardContent>
          <EditBlogForm id={id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
