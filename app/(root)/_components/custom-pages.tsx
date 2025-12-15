"use client";

import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import RenderPageContent from "./render-page-content";

const CustomPages = () => {
  const trpc = useTRPC();
  const pathname = usePathname();

  const { data: pageData } = useQuery(
    trpc.getPageDataBySlug.queryOptions({ slug: pathname  })
  );

  return (
    <main className="space-y-2">
      <section className="mx-auto">
        {pageData && pageData.content && (
          <RenderPageContent json={JSON.parse(pageData.content)} />
        )}
      </section>
    </main>
  );
};

export default CustomPages;
