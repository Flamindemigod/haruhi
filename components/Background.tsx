import Image from "next/image";
import cx from "classnames";
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
          sizes="100vw"
          className="banner--image | object-cover"
          alt={""}
        />
      ) : (
        <div className="background--empty | absolute inset-0 object-cover" />
      )}
    </div>
  );
};

export default Background;
