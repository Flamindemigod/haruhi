'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export default ({ children }: { children: ReactNode }) => (
  <ThemeProvider attribute='class'>{children}</ThemeProvider>
);
