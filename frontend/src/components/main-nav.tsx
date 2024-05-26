import Link from "next/link"

import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation'

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className={cn(
          'transition-colors hover:text-primary',
          pathname === '/' ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        Directory
      </Link>
      <Link
        href="/map"
        className={cn(
          'transition-colors hover:text-primary',
          pathname === '/map' ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        Map
      </Link>
    </nav>
  )
}