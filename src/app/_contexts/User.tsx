'use client';

import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { ReactNode, createContext, useContext } from 'react';
import { api } from '~/trpc/react';

const UserContext = createContext<User | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: sesh } = useSession();
  const { data: user } = api.user.getUser.useQuery(undefined, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    enabled: !!sesh?.user,
  });

  return (
    <UserContext.Provider value={!!sesh?.user ? user ?? null : null}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
