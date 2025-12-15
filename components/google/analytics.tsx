"use client";

import { useTRPC } from "@/lib/trpc/client";
import { GoogleTagSettings } from "@/schema/settings";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function Analytics() {
  const trpc = useTRPC();
  const pathname = usePathname();
  const { data: google } = useQuery(
    trpc.getSettingsByCategory.queryOptions({ category: "google-tags" })
  );

  useEffect(() => {
    if (!google) return;

    const googleTags = JSON.parse(google.value) as GoogleTagSettings;
    const GA_MEASUREMENT_ID: string = googleTags.gaMeasurementId;

    if (!window.gtag) return;
    if (pathname.startsWith("/admin")) return;

    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: pathname,
    });
  }, [google, pathname]);

  if (!google) return null;

  return null;
}
