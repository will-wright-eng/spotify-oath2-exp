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
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted">
              <tr>
                <th scope="col" className="px-6 py-3">Track</th>
                <th scope="col" className="px-6 py-3">Artist</th>
                <th scope="col" className="px-6 py-3">Album</th>
                <th scope="col" className="px-6 py-3">Played At</th>
              </tr>
            </thead>
            <tbody>
              {recentTracks?.map((track: any) => (
                <tr key={track.id} className="bg-background border-b hover:bg-muted/50">
                  <td className="px-6 py-4 font-medium">
                    <span className="line-clamp-1">{track.name}</span>
                  </td>
                  <td className="px-6 py-4">{track.artist}</td>
                  <td className="px-6 py-4">{track.album}</td>
                  <td className="px-6 py-4">
                    {new Date(track.played_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
