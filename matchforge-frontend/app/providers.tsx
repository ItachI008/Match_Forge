// app/providers.tsx
'use client';

import { AppProvider } from '@/context/AppContext';
// Import other providers like ThemeProvider if needed
// import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      {/* Wrap with other providers if they exist */}
      {children}
    </AppProvider>
  );
}