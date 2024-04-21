import React from "react";
import { PuffLoader } from "react-spinners";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  showLabel?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  loading,
  icon,
  showLabel = true,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="px-4 py-3 disabled:bg-slate-100 disabled:text-slate-400 disabled:ring-0 bg-white text-black shadow-sm rounded border focus:outline-none active:outline-none active:ring-2 ring-offset-2 ring-rose-500"
    >
      <div className="flex items-center gap-2">
        {loading && <PuffLoader className="animate-spin" size={24} />}
        {icon && icon}
        {showLabel && <span>{label}</span>}
      </div>
    </button>
  );
};
