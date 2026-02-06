import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
            <ShieldX className="size-16 text-destructive" />
          </div>

          <CardTitle className="text-2xl">Access Denied!</CardTitle>
          <CardDescription className="max-w-xs mx-auto">
            This page is only accessible to admins!.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Link href={"/"} className={buttonVariants({ className: "w-full"})}>
            <ArrowLeft className="mr-1 size-4" />
            Go to Home
            </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
