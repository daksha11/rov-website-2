import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg bg-[rgba(208,190,165,0.03)] backdrop-blur-sm border border-[rgba(208,190,165,0.14)] px-3.5 py-2 text-sm text-[#FFF4E3] shadow-[inset_0_1px_0_rgba(255,244,227,0.03)] transition-all duration-200 placeholder:text-[rgba(208,190,165,0.4)] hover:border-[rgba(208,190,165,0.24)] hover:bg-[rgba(208,190,165,0.05)] focus-visible:outline-none focus-visible:border-[rgba(208,190,165,0.55)] focus-visible:bg-[rgba(208,190,165,0.06)] focus-visible:ring-2 focus-visible:ring-[rgba(208,190,165,0.2)] disabled:cursor-not-allowed disabled:opacity-50",
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
