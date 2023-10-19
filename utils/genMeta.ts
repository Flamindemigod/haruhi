// https://nextjs.org/docs/app/api-reference/functions/generate-metadata


import { Metadata } from "next";

export type MetaOverride = {
  title?: string, 
  description?: string, 
  image?: string, 
}

const genMeta = (props: MetaOverride) => {
  return ({
    viewport: {width: "device-width", initialScale: 1},
    title: props.title ?? "Haruhi",
    applicationName: "Haruhi",
    description: props.description ?? "Haruhi is a Free and Robust Anime and Manga Streaming platform built using NextJS with built-in Anilist integration, so it tracks your anime and manga for you. Made for you with love by Flamindemigod",
    colorScheme: "dark", 
    referrer: 'origin-when-cross-origin',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: "/favicon.ico"
    },
    openGraph:{
      type: "website",
      title: props.title ?? "Haruhi",
      description: props.description ??  "Haruhi is a Free and Robust Anime and Manga Streaming platform built using NextJS with built-in Anilist integration, so it tracks your anime and manga for you. Made for you with love by Flamindemigod",
      locale: "en_GB",
      alternateLocale: "en_US", 
      siteName: "Haruhi", 
      images: [{
        url: props.image ?? "/haruhiHomeBg.webp"
      }]
    },
    authors: {name: "Flamindemigod", url: "https://www.flamindemigod.com"},
    category: "Anime", 
    keywords: ["Haruhi", "Anime", "Manga", "Streaming", "Free", "NoAds", "Ad Free", "Anilist", "Flamindemiod", "React", "NextJS", "Online"],
    creator: "Flamindemigod",
    robots: {
      index: true, 
      follow: false,
      nositelinkssearchbox: false, 
      nosnippet: false, 
      googleBot:{
        index: true,
        follow: false, 
        nositelinkssearchbox: false, 
        nosnippet: false,
      }, 
    },
    themeColor: "#cc006d", 
    twitter: {
      card: "summary_large_image",
      title: props.title ?? "Haruhi", 
      description: props.description ?? "Haruhi is a Free and Robust Anime and Manga Streaming platform built using NextJS with built-in Anilist integration, so it tracks your anime and manga for you. Made for you with love by Flamindemigod", 
      images: [props.image ?? '/haruhiHomeBg.webp'],
    },
    assets: ['/public']
  } as Metadata)
  
}


export default genMeta;