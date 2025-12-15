"use client";

import { useTRPC } from "@/lib/trpc/client";
import { GoogleTagSettings } from "@/schema/settings";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function AdSlot() {
  const trpc = useTRPC();
  const { data: google } = useQuery(
    trpc.getSettingsByCategory.queryOptions({ category: "google-tags" })
  );

  useEffect(() => {
    try {
      if (
        typeof window !== "undefined" &&
        (window.adsbygoogle = window.adsbygoogle || [])
      ) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error("AdSense ad load failed:", e);
    }
  }, []);
    
  if (!google) return null;

  const googleTags = JSON.parse(google.value) as GoogleTagSettings;

  const adClient: string = googleTags.adsenseId;

  if (!adClient) return null;


  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={adClient}
      data-ad-slot="1234567890"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
