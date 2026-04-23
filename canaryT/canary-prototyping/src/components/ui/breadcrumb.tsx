import * as React from 'react'
import { ChevronRight, Ellipsis } from 'lucide-react'
import { cn } from '@/lib/utils'

function Breadcrumb({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn(
        'flex items-center gap-1 border-b border-border bg-background px-6 py-6',
        className,
      )}
      {...props}
    />
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      className={cn('flex items-center gap-1', className)}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      className={cn('inline-flex items-center gap-1', className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  className,
  active,
  ...props
}: React.ComponentProps<'a'> & { active?: boolean }) {
  return (
    <a
      className={cn(
        'inline-flex items-center gap-1 text-sm font-normal transition-colors hover:text-foreground',
        active ? 'text-foreground' : 'text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      role="link"
      aria-current="page"
      className={cn(
        'text-sm font-normal text-foreground',
        className,
      )}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  className,
  children,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn('inline-flex items-center text-muted-foreground', className)}
      {...props}
    >
      {children ?? <ChevronRight className="h-3.5 w-3.5" />}
    </li>
  )
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn('inline-flex items-center justify-center text-muted-foreground', className)}
      {...props}
    >
      <Ellipsis className="h-4 w-4" />
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
