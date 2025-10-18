"use client";
import Script from "next/script";

// Simple Analytics loader and event helper for GA4
export default function AnalyticsLoader() {
  const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_ID}', { send_page_view: true });`}
      </Script>
    </>
  );
}

// Event helper
export function trackEvent(name, params = {}) {
  try {
    if (typeof window === "undefined") return;
    if (!window.dataLayer) window.dataLayer = [];
    window.dataLayer.push({ event: name, ...params });
  } catch (e) {
    // swallow errors, analytics should not break UX
    // console.debug("trackEvent error", e);
  }
}
