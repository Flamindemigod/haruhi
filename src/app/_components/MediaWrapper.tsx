"use client";

import { ReactNode } from "react";
import { MediaContextProvider } from "../utils/Media";

export default ({ children }: { children: ReactNode }) => {
  return <MediaContextProvider>{children}</MediaContextProvider>;
};
