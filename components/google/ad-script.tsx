"use client";

import { useTRPC } from "@/lib/trpc/client";
import { GoogleTagSettings } from "@/schema/settings";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Script from "next/script";
import React from "react";

const AdScript = () => {
  const pathname = usePathname();
  const trpc = useTRPC();
  const { data: google } = useQuery(
    trpc.getSettingsByCategory.queryOptions({ category: "google-tags" })
  );

  if (!google) return null;

  const googleTags = JSON.parse(google.value) as GoogleTagSettings;

  const adClient: string = googleTags.adsenseId;

  if (!adClient) return null;

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/verify-request")
  )
    return;

  return (
    <Script
      strategy="afterInteractive"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
      crossOrigin="anonymous"
    />
  );
};

export default AdScript;
