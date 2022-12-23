import React from "react";

type Props = {
  children: React.ReactNode;
};

const Grid = (props: Props) => {
  return (
    <div className="mt-4 grid justify-center items-center gap-4 w-full p-2 grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10 3xl:grid-cols-12">
      {props.children}
    </div>
  );
};

export default Grid;
