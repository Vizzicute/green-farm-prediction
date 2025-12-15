"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import { User2 } from "lucide-react";
import React from "react";

const TestimonialCarousel = () => {
  const trpc = useTRPC();

  const {
      data: comments,
      isLoading,
    } = useQuery(
      trpc.adminGetComments.queryOptions({
        type: "SUBSCRIPTION",
        filters: { status: "APPROVED" },
        pageNumber: 1,
        pageSize: 30,
      })
    );
  
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  return (
    <div className="relative flex items-center justify-center p-2">
      <div className="absolute top-0 bottom-0 -right-6 z-10 w-18 bg-gradient-to-r from-transparent to-background pointer-events-none" />
      <div className="absolute top-0 bottom-0 -left-6 z-10 w-18 bg-gradient-to-l from-transparent to-background pointer-events-none" />
      <Carousel
        opts={{ align: "center" }}
        orientation="horizontal"
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="w-full max-h-xs md:max-h-md"
      >
        <CarouselContent className="w-[90%] md:w-3/4">
          {comments?.map((comment, index) => (
            <CarouselItem key={index} className="pt-1 md:basis-1/2">
              <div className="p-1">
                <Card className="border-2 border-muted/20 hover:border-primary transition-colors">
                  <CardContent className="flex flex-col items-start justify-center p-2">
                    <div className="w-full flex items-center justify-between md:p-2 p-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8 border-2 border-foreground/70">
                          {comment.user?.image && !isLoading ? (
                            <AvatarImage
                              src={comment.user?.image}
                              className="object-contain"
                            />
                          ) : (
                            <AvatarFallback>
                              <User2 />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="max-sm:hidden flex flex-col items-start">
                          <span className="text-sm font-medium">
                            {comment.user?.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <span
                              className={`w-2 h-2 bg-green-500 rounded-full`}
                            />
                            <span className="text-[10px] text-gray-500 capitalize">
                              user
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.user?.createdAt ?? "").toDateString()}
                      </p>
                    </div>
                    <p className="text-sm italic text-left line-clamp-4 md:ms-12">
                      "{comment.content}"
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-5" />
        <CarouselNext className="mr-5" />
      </Carousel>
    </div>
  );
};

export default TestimonialCarousel;
