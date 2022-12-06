"use client";
import { Analytics } from "@vercel/analytics/react";
import React from "react";

const AnalyticsWrapper = () => {
  return (
    <Analytics
      beforeSend={(event) => {
        const url = new URL(event.url);
        url.searchParams.delete("username");
        return {
          ...event,
          url: url.toString(),
        };
      }}
    />
  );
};

export default AnalyticsWrapper;
