'use client'

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { spotifyApi } from "@/lib/api"
import { NowPlaying } from "@/components/spotify/now-playing"
import { RecentTracks } from "@/components/spotify/recent-tracks"

export default function DashboardPage() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: spotifyApi.getCurrentUser,
  })
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{user?.display_name}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <NowPlaying />
        <RecentTracks />
      </div>
    </div>
  )
}
