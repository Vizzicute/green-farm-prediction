"use client";

import { useTRPC } from "@/lib/trpc/client";
import { GoogleTagSettings } from "@/schema/settings";
import { useQuery } from "@tanstack/react-query";
import Script from "next/script";
import React from "react";

const AnalyticScript = () => {
  const trpc = useTRPC();
    const { data: google } = useQuery(
      trpc.getSettingsByCategory.queryOptions({ category: "google-tags" })
    );
  
    if (!google) return null;
  
    const googleTags = JSON.parse(google.value) as GoogleTagSettings;

  const GA_MEASUREMENT_ID: string = googleTags?.gaMeasurementId || "";

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <Script
      id="gtag-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `,
      }}
    />
  );
};

export default AnalyticScript;
