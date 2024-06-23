'use client'

import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "d-flex align-items-center rounded btn btn-danger px-4 text-sm font-medium text-white h-100",
        className
      )}
    >
      {children}
    </button>
  );
}
