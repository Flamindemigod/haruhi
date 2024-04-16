'use client';

import cx from 'classix';
import { ReactNode } from 'react';

interface Props
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
}

const styles =
  'text-md rounded-md p-2 text-offWhite-700 dark:text-offWhite-100 border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700 flex gap-2 items-center justify-center' as const;

const Button = ({ children, className, ...props }: Props) => {
  return (
    <button className={cx(styles, className)} {...props}>
      {children}
    </button>
  );
};

Button.displayName = 'Input';
export default Button;
