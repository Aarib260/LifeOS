"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onDrag" |
    "onDragStart" |
    "onDragEnd" |
    "onAnimationStart" |
    "onAnimationEnd"
  > {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-[#4FD1FF] hover:bg-[#67E8F9] text-[#050B14]",
    secondary: "bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08]",
    ghost: "bg-transparent hover:bg-white/[0.04] text-white border border-white/[0.08]",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "px-6 py-3 rounded-full text-sm font-medium transition-colors duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}