import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import cx from "classnames";
import Link from "next/link";
import React from "react";
import Image from "next/image";
type Props = {};

const NavigationMenu = (props: Props) => {
  return (
    <NavigationMenuPrimitive.Root className="relative z-50">
      <NavigationMenuPrimitive.List className="flex justify-center items-center flex-row rounded-lg bg-white dark:bg-offWhite-800 p-2 space-x-2">
        <NavigationMenuPrimitive.Item asChild>
          <NavigationMenuPrimitive.Link
            asChild
            className={cx(
              " px-3 py-2 rounded-md hover:bg-offWhite-100 dark:hover:bg-offWhite-900",
              "text-sm md:text-base font-semibold text-offWhite-700 dark:text-offWhite-100"
            )}
          >
            <Link href={"/"}>Home</Link>
          </NavigationMenuPrimitive.Link>
        </NavigationMenuPrimitive.Item>
        <NavigationMenuPrimitive.Item>
          <NavigationMenuPrimitive.Trigger
            className={cx(
              "px-3 py-2 rounded-md hover:bg-offWhite-100 dark:hover:bg-offWhite-900",
              "text-sm md:text-base font-semibold",
              "text-offWhite-700 dark:text-offWhite-100",
              "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
            )}
          >
            Lists
          </NavigationMenuPrimitive.Trigger>

          <NavigationMenuPrimitive.Content
            className={cx(
              "absolute w-auto top-0 left-0 rounded-lg",
              "radix-motion-from-start:animate-enter-from-left",
              "radix-motion-from-end:animate-enter-from-right",
              "radix-motion-to-start:animate-exit-to-left",
              "radix-motion-to-end:animate-exit-to-right"
            )}
          >
            <div className="w-[21rem] lg:w-[23rem] p-3 ">
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-2 w-full p-4 rounded-md relative">
                  <Image
                    fill
                    style={{ objectFit: "cover" }}
                    src={
                      "/__suzumiya_haruhi_suzumiya_haruhi_no_yuuutsu_drawn_by_motimotica__sample-5441979e3a83f572ba0b901efdc26868.jpg"
                    }
                    alt={""}
                    sizes={"10vw"}
                  ></Image>
                </div>

                <div className="col-span-4 w-full flex flex-col space-y-3  p-4 rounded-md">
                  <NavigationMenuPrimitive.Link
                    asChild
                    className={cx(
                      "px-3 py-2  rounded-md hover:bg-offWhite-100 dark:hover:bg-offWhite-900",
                      "text-sm md:text-base  text-center text-offWhite-700 dark:text-offWhite-100"
                    )}
                  >
                    <Link href={"/anime"}>Anime</Link>
                  </NavigationMenuPrimitive.Link>
                  <NavigationMenuPrimitive.Link
                    asChild
                    className={cx(
                      "px-3 py-2  rounded-md hover:bg-offWhite-100 dark:hover:bg-offWhite-900",
                      "text-sm md:text-base  text-center text-offWhite-700 dark:text-offWhite-100"
                    )}
                  >
                    <Link href={"/manga"}>Manga</Link>
                  </NavigationMenuPrimitive.Link>
                </div>
              </div>
            </div>
          </NavigationMenuPrimitive.Content>
        </NavigationMenuPrimitive.Item>

        <NavigationMenuPrimitive.Item asChild>
          <NavigationMenuPrimitive.Link
            asChild
            className={cx(
              "px-3 py-2 rounded-md hover:bg-offWhite-100 dark:hover:bg-offWhite-900",
              "text-sm md:text-base font-semibold  text-offWhite-700 dark:text-offWhite-100"
            )}
          >
            <Link href={"/seasonal"}>Seasonal</Link>
          </NavigationMenuPrimitive.Link>
        </NavigationMenuPrimitive.Item>

        <NavigationMenuPrimitive.Indicator
          className={cx(
            "z-10",
            "top-[100%] flex items-end justify-center h-2 overflow-hidden",
            "radix-state-visible:animate-fade-in",
            "radix-state-hidden:animate-fade-out",
            "transition-[width_transform] duration-[250ms] ease-[ease]"
          )}
        >
          <div className="top-1 relative bg-white dark:bg-offWhite-800 w-2 h-2 rotate-45" />
        </NavigationMenuPrimitive.Indicator>
      </NavigationMenuPrimitive.List>

      <div
        className={cx(
          "absolute flex justify-center",
          "w-[140%] left-[-20%] top-[100%]"
        )}
        style={{
          perspective: "2000px",
        }}
      >
        <NavigationMenuPrimitive.Viewport
          className={cx(
            "relative mt-2 shadow-lg rounded-md bg-white dark:bg-offWhite-800 overflow-hidden",
            "w-radix-navigation-menu-viewport",
            "h-radix-navigation-menu-viewport",
            "radix-state-open:animate-scale-in-content",
            "radix-state-closed:animate-scale-out-content",
            "origin-[top_center] transition-[width_height] duration-300 ease-[ease]"
          )}
        />
      </div>
    </NavigationMenuPrimitive.Root>
  );
};

export default NavigationMenu;
