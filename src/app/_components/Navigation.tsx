"use client";
import { useMediaQuery } from "../hooks/useMediaQuery";
import NavigationDesktop from "./Navigation.Desktop";
import NavigationMobile from "./Navigation.Mobile";

export type NavigationProps = {
  isUserAuth: boolean;
};
export default (props: NavigationProps) => {
  const matches = useMediaQuery(`(min-width: 640px)`);
  return (
    <>
      <div className="w-full sm:hidden">
        {(matches === null || !matches) && <NavigationMobile {...props} />}
      </div>
      <div className="hidden w-full sm:block">
        {(matches === null || !!matches) && <NavigationDesktop {...props} />}
      </div>
    </>
  );
};
