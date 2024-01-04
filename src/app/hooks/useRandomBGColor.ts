import { useMemo } from "react";
import Prando from "prando";

const backgroundColors = [
  "bg-primary-500",
  "bg-red-400",
  "bg-orange-400",
  "bg-lime-500",
  "bg-green-500",
  "bg-emerald-600",
  "bg-cyan-500",
  "bg-sky-600",
  "bg-blue-400",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-rose-400",
];

export default (seed?: string | number) => {
  return useMemo(() => {
    let rng = new Prando(seed);
    return rng.nextArrayItem(backgroundColors);
    // backgroundColors[Math.floor(rng.next()*backgroundColors.length)]
  }, [seed]);
};
