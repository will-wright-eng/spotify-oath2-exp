'use client'

import { NowPlaying } from "@/components/spotify/now-playing"
import { RecentTracks } from "@/components/spotify/recent-tracks"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <NowPlaying />
      </div>
      <div className="grid gap-4 md:grid-cols-1">
        <RecentTracks />
      </div>
    </div>
  )
}
