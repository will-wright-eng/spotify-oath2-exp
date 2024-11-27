'use client'
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { spotifyApi } from "@/lib/api"
export function RecentTracks() {
  const { data: recentTracks, isLoading } = useQuery({
    queryKey: ['recent-tracks'],
    queryFn: () => spotifyApi.getRecentTracks(),
    refetchInterval: 30000,
  })
  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Played</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTracks?.map((track: any) => (
            <div key={track.id} className="flex items-center space-x-4">
              <img
                src={track.album.images[0].url}
                alt={track.album.name}
                className="h-12 w-12 rounded"
              />
              <div>
                <p className="font-medium line-clamp-1">{track.name}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {track.artists.map((a: any) => a.name).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
