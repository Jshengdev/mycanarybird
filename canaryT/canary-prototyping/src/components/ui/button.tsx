import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { AsciiHover } from '@/components/ui/AsciiHover'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-bold font-sans text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 select-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground border border-border',
        destructive:
          'bg-destructive text-destructive-foreground',
        outline:
          'border border-border bg-transparent hover:bg-muted hover:text-accent-foreground',
        secondary:
          'bg-card text-foreground border border-border',
        ghost: 'hover:bg-muted hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-1',
        sm: 'h-7 px-2.5',
        lg: 'h-10 px-6',
        icon: 'h-9 w-9',
        'icon-sm': 'h-7 w-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function getAsciiColor(variant: string | null | undefined): string {
  switch (variant) {
    case 'default':     return '#F7F7F7' // text-white on primary bg
    case 'destructive': return '#F7F7F7' // text-white on destructive bg
    case 'secondary':   return '#858585' // icon-grey on card bg
    default:            return '#858585'
  }
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    const hasDither = variant !== 'ghost' && variant !== 'link' && variant !== 'outline'

    if (hasDither) {
      return (
        <AsciiHover
          variant="both"
          color={getAsciiColor(variant)}
          className={cn(buttonVariants({ variant, size, className }))}
        >
          <button ref={ref} className="w-full h-full flex items-center justify-center" {...props}>
            {children}
          </button>
        </AsciiHover>
      )
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
