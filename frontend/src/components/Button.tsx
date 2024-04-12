import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const Button: React.FC<ButtonProps> = ({ label, ...props }) => {
  return (
    <button
      {...props}
      className="px-4 py-3 disabled:bg-slate-100 disabled:text-slate-400 disabled:ring-0 bg-white shadow-sm rounded border focus:outline-none active:outline-none active:ring-2 ring-offset-2 ring-slate-500"
    >
      {label}
    </button>
  );
};
