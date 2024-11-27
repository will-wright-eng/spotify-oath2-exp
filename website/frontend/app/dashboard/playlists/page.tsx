'use client'

import { Playlists } from "@/components/spotify/playlists"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Playlists />
      </div>
    </div>
  )
}
