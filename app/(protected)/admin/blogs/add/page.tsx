import React from "react";
import AddBlogForm from "./_components/add-blog-form";
import { Card, CardContent } from "@/components/ui/card";

const page = () => {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">Add Blog Post</h1>
      <Card className="rounded-none">
        <CardContent>
          <AddBlogForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
