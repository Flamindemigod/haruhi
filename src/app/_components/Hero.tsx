import cx from "classix";
import { Georama } from "next/font/google";

const georama = Georama({ subsets: ["latin"] });
const Hero = () => {
  return (
    <div className="relative flex h-[60vh] w-full flex-col justify-center gap-2 bg-white/50  p-12 text-black dark:bg-black/75 dark:text-white">
      <h3 className={cx(georama.className, "text-3xl font-medium")}>
        Welcome To Haruhi
      </h3>
      <p className={cx(georama.className, "text-lg")}>
        A next gen anime and manga platform made for you with anilist
        integration to provide a seemless watching experience
      </p>
    </div>
  );
};

export default Hero;
