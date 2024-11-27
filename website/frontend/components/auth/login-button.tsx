'use client';
import { Button } from '@/components/ui/button';
import { spotifyApi } from '@/lib/api';
export function LoginButton() {
  const handleLogin = async () => {
    try {
      const { auth_url } = await spotifyApi.login();
      window.location.href = auth_url;
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  return (
    <Button
      onClick={handleLogin}
      className="bg-spotify-green hover:bg-spotify-green-dark"
    >
      Connect with Spotify
    </Button>
  );
}
