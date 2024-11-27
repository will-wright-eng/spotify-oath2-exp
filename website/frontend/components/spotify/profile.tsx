'use client'

import { useQuery } from "@tanstack/react-query"
import { spotifyApi } from "@/lib/api"

export function Profile() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: spotifyApi.getCurrentUser,
  })

  return (
    <div className="flex items-center gap-3">
      {user?.images?.[0]?.url && (
        <img
          src={user.images[0].url}
          alt="Profile"
          className="h-8 w-8 rounded-full"
        />
      )}
      <div className="hidden md:block">
        <p className="text-sm font-medium leading-none">{user?.display_name}</p>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
      </div>
    </div>
  )
}
