import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-slate-200 bg-white hover:bg-slate-100 text-slate-800",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
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
  render?: React.ReactElement
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, render, ...props }, ref) => {
    const classes = buttonVariants({ variant, size, className })
    if (render) {
      const child = render as React.ReactElement<any>
      return React.cloneElement(child, {
        ...props,
        className: cn(classes, child.props.className),
      }, props.children)
    }
    return <button className={classes} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }