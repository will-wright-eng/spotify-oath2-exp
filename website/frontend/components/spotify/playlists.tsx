'use client'

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { spotifyApi } from "@/lib/api"

export function Playlists() {
  const { data: playlists, isLoading } = useQuery({
    queryKey: ['playlists'],
    queryFn: () => spotifyApi.getPlaylists(),
    refetchInterval: 30000,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Playlists</CardTitle>
        <Button variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Playlist
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {playlists?.items?.map((playlist: any) => (
            <div key={playlist.id} className="flex items-center space-x-4">
              <img
                src={playlist.images?.[0]?.url ?? '/default-playlist-cover.jpg'}
                alt={playlist.name}
                className="h-12 w-12 rounded"
              />
              <div className="flex-1">
                <p className="font-medium line-clamp-1">{playlist.name}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {playlist.tracks.total} tracks • {playlist.public ? 'Public' : 'Private'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
