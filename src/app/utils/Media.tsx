"use client";

import { createMedia } from "@artsy/fresnel";

const AppMedia = createMedia({
  breakpoints: {
    xs: 0,
    sm: 475,
    md: 640,
    lg: 768,
    xl: 1024,
  },
});

// Generate CSS to be injected into the head
export const mediaStyle = AppMedia.createMediaStyle();
export const { Media, MediaContextProvider } = AppMedia;
