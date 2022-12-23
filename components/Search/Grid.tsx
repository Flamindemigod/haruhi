import React from "react";

type Props = {
  children: React.ReactNode;
};

const Grid = (props: Props) => {
  return (
    <div className="mt-4 w-max grid justify-center items-center gap-4 p-2 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7">
      {props.children}
    </div>
  );
};

export default Grid;
