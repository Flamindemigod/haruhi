"use client";
import { Media } from "../utils/Media";
import NavigationDesktop from "./Navigation.Desktop";
import NavigationMobile from "./Navigation.Mobile";

export type NavigationProps = {
  isUserAuth: boolean;
};
export const Navigation = (props: NavigationProps) => {
  return (
    <>
      <Media lessThan="md" className="w-full">
        <NavigationMobile {...props} />
      </Media>
      <Media greaterThanOrEqual="md" className="w-full">
        <NavigationDesktop {...props} />
      </Media>
    </>
  );
};
