'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { Profile } from "@/components/spotify/profile"
import { LogoutButton } from "@/components/auth/logout-button"

export function Header() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/playlists",
      label: "Playlists",
      active: pathname === "/dashboard/playlists",
    },
  ]
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 md:px-6">
        <div className="mr-4 flex">
          {user && (
            <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Spotify Dashboard</span>
            </Link>
          )}
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {user && routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  route.active ? "text-foreground" : "text-foreground/60"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {user && (
            <>
              <Profile />
              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
