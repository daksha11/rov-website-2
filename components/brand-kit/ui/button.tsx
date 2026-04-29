import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[rgba(208,190,165,0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3B2114]",
  {
    variants: {
      variant: {
        default:
          "btn-brown cta-shine shadow-[0_4px_20px_rgba(59,33,20,0.5)] hover:shadow-[0_6px_28px_rgba(59,33,20,0.7)] border border-[rgba(208,190,165,0.22)]",
        tan:
          "btn-tan shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)]",
        destructive:
          "bg-destructive/80 text-[#FFF4E3] backdrop-blur-md border border-destructive/40 hover:bg-destructive/90",
        outline:
          "surface-2 text-[#FFF4E3] hover:bg-[rgba(208,190,165,0.1)] hover:border-[rgba(208,190,165,0.3)]",
        secondary:
          "bg-[rgba(96,62,37,0.6)] text-[#FFF4E3] backdrop-blur-md border border-[rgba(208,190,165,0.15)] hover:bg-[rgba(96,62,37,0.85)] hover:border-[rgba(208,190,165,0.25)]",
        ghost:
          "text-[#FFF4E3]/75 hover:text-[#FFF4E3] hover:bg-[rgba(208,190,165,0.06)] border border-transparent hover:border-[rgba(208,190,165,0.12)]",
        link: "text-[#D0BEA5] underline-offset-4 hover:underline hover:text-[#FFF4E3]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "size-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
