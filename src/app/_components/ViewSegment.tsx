import { ReactNode } from "react";

export type Props = {
  title?: string;
  children: ReactNode;
};

export default (props: Props) => {
  return (
    <div className="w-full bg-offWhite-50 px-2 dark:bg-offWhite-800">
      <div className="px-2 pt-2 text-xl font-medium empty:hidden">
        {props.title}
      </div>
      {props.children}
    </div>
  );
};
