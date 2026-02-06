"use client";

import LogoutButton from "@/components/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { ArrowRight, User2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import TestimonialCarousel from "./testimonial-carousel";

const Hero = ({h1tag, description}:{ h1tag: string, description: string}) => {
  const session = useSession();
  return (
    <div className="container mx-auto p-4 text-center bg-secondary/20">
      <h1 className="text-2xl md:text-4xl font-bold">
        {h1tag}
      </h1>
      <p className="mt-4 text-md md:text-xl brand-name">
        {description}
      </p>
      <div className="mt-4">
        {session.data ? (
          <div className="flex items-center justify-center gap-2">
            <LogoutButton variant={"outline"} />
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "default",
                className: "gap-2",
              })}
            >
              <Avatar className="size-6">
                {session.data?.user.image ? (
                  <AvatarImage
                    src={session.data.user.image}
                    className="object-contain"
                  />
                ) : (
                  <AvatarFallback className="bg-background/10">
                    <User2 />
                  </AvatarFallback>
                )}
              </Avatar>{" "}
              Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Link
              href={"/login"}
              className={buttonVariants({
                variant: "outline",
                className: "p-2",
              })}
            >
              Sign In
            </Link>
            <Link
              href={"/login"}
              className={buttonVariants({
                variant: "default",
                className: "p-2",
              })}
            >
              Learn More <ArrowRight className="size-3" />
            </Link>
          </div>
        )}
      </div>

      <div>
        <TestimonialCarousel />
      </div>
    </div>
  );
};

export default Hero;
