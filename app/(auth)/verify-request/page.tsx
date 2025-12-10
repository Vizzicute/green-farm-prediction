import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { Suspense } from "react";
import VerificationForm from "./_components/verifcation-form";

const page = () => {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please check your email</CardTitle>
        <CardDescription>
          we have sent a verificationemail code to your mailbox. please open
          your email and paste the code below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>Loading...</div>}>
          <VerificationForm />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default page;
