import React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  inconOnly?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-blue-600 text-white hover:bg-blue-700
    dark:bg-blue-500 dark:hover:bg-blue-600
    focus:ring-blue-500 dark:focus:ring-blue-400
  `,
  secondary: `
    bg-gray-600 text-white hover:bg-gray-700
    dark:bg-gray-500 dark:hover:bg-gray-600
    focus:ring-gray-500 dark:focus:ring-gray-400
  `,
  outline: `
    border border-gray-300 text-gray-700 hover:bg-gray-100
    dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700
    focus:ring-gray-300 dark:focus:ring-gray-500
  `,
  danger: `
    bg-red-600 text-white hover:bg-red-700
    dark:bg-red-500 dark:hover:bg-red-600
    focus:ring-red-500 dark:focus:ring-red-400
  `,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        (disabled || loading) &&
        "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white dark:border-gray-300 border-t-transparent" />
      )}
      {children}
    </button>
  );
};


export default Button;