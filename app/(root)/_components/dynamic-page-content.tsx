"use client";

import { useTRPC } from "@/lib/trpc/client";
import React, { useMemo, useState } from "react";
import Hero from "./hero";
import PredictionSection from "./prediction-section";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { formattedDate } from "@/utils";
import Link from "next/link";
import { Banknote, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import CategoriesSection from "./categories-section";
import RenderPageContent from "./render-page-content";
import BlogSection from "./blog-section";
import SubscriptionCounter from "./subscription-counter";

const DynamicPageContent = () => {
  const trpc = useTRPC();
  const pathname = usePathname();

  const [customDate, setCustomDate] = useState<Date>(new Date());

  const filters = useMemo(() => {
    const f: any = {};
    if (!pathname) return f;

    switch (pathname) {
      case "/":
        f.SubscriptionCategory = { name: "free" };
        break;

      case "/basketball":
        f.sport = "BASKETBALL";
        f.tip = { in: ["1", "X", "2"] };
        break;

      case "/basketball-over":
        f.sport = "BASKETBALL";
        f.tip = { in: ["OV", "UN", "over", "under"] };
        break;

      case "/banker":
        f.banker = true;
        break;

      case "/btts":
        f.btts = true;
        break;

      case "/either":
        f.either = { in: ["HWEH", "DEH", "AWEH"] };
        break;

      case "/htft":
        f.either = {
          in: ["1/1", "1/X", "1/2", "X/1", "X/X", "X/2", "2/1", "2/X", "2/2"],
        };
        break;

      case "/overs":
        f.over = {
          in: [
            "OV1.5",
            "OV2.5",
            "OV3.5",
            "OV4.5",
            "UN4.5",
            "UN3.5",
            "UN2.5",
            "UN1.5",
          ],
        };
        break;

      case "/chance":
        f.either = { in: ["1X", "12", "X2"] };
        break;

      case "/draw":
        f.tip = { in: ["X", "X/X", "draw"] };
        break;

      default:
        break;
    }

    return f;
  }, [pathname]);

  const { data: filteredPrediction, isLoading } = useQuery(
    trpc.getPredictions.queryOptions({
      filters: {
        ...filters,
        customStartDate: formattedDate(customDate),
        customEndDate: formattedDate(customDate),
      },
      pageSize: 100,
      currentPage: 1,
    })
  );

  const { data: pageData } = useQuery(
    trpc.getPageDataBySlug.queryOptions({ slug: pathname  })
  );

  return (
    <main className="space-y-2">
      <section>
        <Hero />
      </section>
      <section className="flex items-center justify-center mx-auto">
        <PredictionSection
          isLoading={isLoading}
          customDate={customDate}
          setCustomDate={setCustomDate}
          predictions={filteredPrediction}
        />
      </section>
      <section className="flex items-center justify-center gap-1 px-6">
        <Link
          href={"/banker"}
          className={cn(
            buttonVariants({
              className:
                "flex items-center justify-center hover:underline rounded",
              variant: "outline",
            })
          )}
        >
          <Banknote className="size-5" /> Banker Bets
        </Link>
        <Link
          href={"#"}
          className={cn(
            buttonVariants({
              className:
                "flex max-sm:flex-1 min-sm:w-3xs items-center jusify-center bg-[#0088cc] rounded font-semibold text-white",
            })
          )}
        >
          <Send className="size-6 rounded-full bg-white text-[#0088cc] p-[2px]" />{" "}
          Join Us
        </Link>
      </section>
      <section className="mx-auto">
        <CategoriesSection />
      </section>
      <section className="mx-auto">
        <SubscriptionCounter/>
      </section>
      <section>
        <BlogSection />
      </section>
      <section className="mx-auto">
        {pageData && pageData.content && (
          <RenderPageContent json={JSON.parse(pageData.content)} />
        )}
      </section>
    </main>
  );
};

export default DynamicPageContent;
