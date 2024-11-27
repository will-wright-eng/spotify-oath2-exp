'use client';
import { useQuery } from '@tanstack/react-query';
import { spotifyApi } from '@/lib/api';
import { Card } from '@/components/ui/card';
export function NowPlaying() {
  const { data, isLoading } = useQuery({
    queryKey: ['now-playing'],
    queryFn: () => spotifyApi.getCurrentTrack(),
    refetchInterval: 10000,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-2">Now Playing</h2>
      {data ? (
        <div className="flex items-center space-x-4">
          {data.album.images.length > 0 && (
            <img
              src={data.album.images[0].url}
              alt={data.album.name}
              className="w-16 h-16 rounded"
            />
          )}
          <div>
            <p className="font-medium">{data.name}</p>
            <p className="text-gray-500">
              {data.artists.map((artist: { name: string }) => artist.name).join(', ')}
            </p>
          </div>
        </div>
      ) : (
        <p>Not playing anything</p>
      )}
    </Card>
  );
}
