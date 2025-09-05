import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  variant = "default",
  padding = "md",
  hover = false,
  className,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-xl border border-gray-100 transition-all duration-200";
  
  const variants = {
    default: "shadow-md",
    elevated: "shadow-lg",
    outlined: "border-2 border-gray-200 shadow-sm",
    gradient: "bg-gradient-to-br from-white to-gray-50 shadow-md"
  };
  
  const paddingStyles = {
    none: "p-0",
    sm: "p-3",
    md: "p-6",
    lg: "p-8"
  };
  
  const hoverStyles = hover ? "hover:shadow-lg hover:-translate-y-1" : "";

  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], paddingStyles[padding], hoverStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;