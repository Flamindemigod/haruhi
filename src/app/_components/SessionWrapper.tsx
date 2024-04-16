'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export default ({ children }: { children: ReactNode }) => (
  <SessionProvider>{children}</SessionProvider>
);
