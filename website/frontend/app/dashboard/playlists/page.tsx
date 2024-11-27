'use client'

import { Playlists } from "@/components/spotify/playlists"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <Playlists />
      </div>
    </div>
  )
}
