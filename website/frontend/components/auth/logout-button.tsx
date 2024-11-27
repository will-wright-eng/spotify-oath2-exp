'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth';
import { spotifyApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps extends Omit<ButtonProps, 'onClick'> {
  variant?: ButtonProps['variant'];
}

export function LogoutButton({ variant = 'ghost', ...props }: LogoutButtonProps) {
  const router = useRouter();
  const { clearSession } = useAuthStore();

  const handleLogout = async () => {
    try {
      await spotifyApi.logout();
      clearSession();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Button onClick={handleLogout} variant={variant} {...props}>
      Logout
    </Button>
  );
}
