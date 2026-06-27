import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg bg-[rgba(240,230,224,0.03)] backdrop-blur-sm border border-[rgba(240,230,224,0.14)] px-3.5 py-2 text-sm text-[#F0E6E0] shadow-[inset_0_1px_0_rgba(240,230,224,0.03)] transition-all duration-200 placeholder:text-[rgba(240,230,224,0.4)] hover:border-[rgba(240,230,224,0.24)] hover:bg-[rgba(240,230,224,0.05)] focus-visible:outline-none focus-visible:border-[rgba(240,230,224,0.55)] focus-visible:bg-[rgba(240,230,224,0.06)] focus-visible:ring-2 focus-visible:ring-[rgba(240,230,224,0.2)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
