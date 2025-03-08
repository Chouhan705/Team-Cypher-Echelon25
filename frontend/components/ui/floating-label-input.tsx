"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, label, id, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(e.target.value !== "")
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value !== "")
      props.onChange?.(e)
    }

    return (
      <div className="relative">
        <input
          id={id}
          type={type}
          className={cn(
            "peer h-14 w-full rounded-md border border-input bg-background px-3 pt-5 pb-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            className,
          )}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={label}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute left-3 text-muted-foreground transition-all duration-200 pointer-events-none",
            isFocused || hasValue ? "top-2 text-xs text-blue-400" : "top-1/2 -translate-y-1/2 text-sm",
          )}
        >
          {label}
        </label>
      </div>
    )
  },
)
FloatingLabelInput.displayName = "FloatingLabelInput"

export { FloatingLabelInput }

