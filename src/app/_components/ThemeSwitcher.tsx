"use client";

import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import Switch from "~/primitives/Switch";

export const ThemeSwitcher = () => {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <div className="flex flex-row items-center gap-2">
      <Switch
        icon={
          resolvedTheme == "light" ? (
            <SunIcon className="text-amber-500" />
          ) : (
            <MoonIcon className="text-offWhite-900" />
          )
        }
        checked={resolvedTheme == "light"}
        onChecked={() => {
          switch (resolvedTheme) {
            case "dark":
              setTheme("light");
              break;
            case "light":
              setTheme("dark");
              break;
          }
        }}
      />
    </div>
  );
};
