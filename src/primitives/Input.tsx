'use client';

import cx from 'classix';
import { forwardRef } from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const styles =
  'text-md rounded-md p-2 text-offWhite-700 placeholder:text-offWhite-500 dark:text-offWhite-100 dark:placeholder:text-offWhite-200 border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700 w-full flex gap-2 items-center justify-center' as const;

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cx(styles, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
export default Input;
