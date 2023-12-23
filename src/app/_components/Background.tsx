import Image from "next/image";
import cx from "classix";
interface Props {
  backgroundImage?: string;
  classes: string;
}

const Background = (props: Props) => {
  return (
    <div className={cx(props.classes, "-z-50")}>
      {props.backgroundImage ? (
        <Image
          src={props.backgroundImage}
          fill
          priority
          sizes="100dvw"
          className="motion-safe:animate-banner-move-s motion-safe:md:animate-banner-move-f object-cover motion-reduce:object-center"
          alt={""}
        />
      ) : (
        <div className="background--empty | absolute inset-0 object-cover" />
      )}
    </div>
  );
};

export default Background;
