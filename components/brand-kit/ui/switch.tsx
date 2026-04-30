"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(208,190,165,0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3B2114] disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-[#D0BEA5] data-[state=checked]:border-[#D0BEA5] data-[state=checked]:shadow-[0_2px_10px_rgba(208,190,165,0.3)]",
      "data-[state=unchecked]:bg-[rgba(208,190,165,0.06)] data-[state=unchecked]:border-[rgba(208,190,165,0.2)]",
      className
    )}
    ref={ref}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block h-3.5 w-3.5 rounded-full shadow-lg ring-0 transition-transform",
        "data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-[#3B2114]",
        "data-[state=unchecked]:translate-x-[2px] data-[state=unchecked]:bg-[rgba(208,190,165,0.5)]"
      )}
    />
  </SwitchPrimitive.Root>
))
Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }
