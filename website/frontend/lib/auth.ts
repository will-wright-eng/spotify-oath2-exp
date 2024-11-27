import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  spotify_id: string;
  display_name: string;
}

interface AuthStore {
  sessionId: string | null;
  user: User | null;
  setSession: (sessionId: string, user: User) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      sessionId: null,
      user: null,
      setSession: (sessionId, user) => {
        set({ sessionId, user });
      },
      clearSession: () => set({ sessionId: null, user: null }),
    }),
    {
      name: 'auth-storage', // name of the item in storage
      partialize: (state) => ({ user: state.user }), // only persist the user data
    }
  )
);
