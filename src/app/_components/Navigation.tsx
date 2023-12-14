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
      <Media lessThan="md">
        <NavigationMobile {...props} />
      </Media>
      <Media greaterThanOrEqual="md">
        <NavigationDesktop {...props} />
      </Media>
    </>
  );
};