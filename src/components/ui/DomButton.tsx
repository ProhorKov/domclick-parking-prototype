import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type DomButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
    size?: "medium" | "large";
  }
>;

export function DomButton({
  children,
  className = "",
  variant = "primary",
  size = "medium",
  type = "button",
  ...props
}: DomButtonProps) {
  return (
    <button
      type={type}
      className={`dom-button dom-button--${variant} dom-button--${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
