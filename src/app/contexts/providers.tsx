'use client';

import { PersProvider } from './usePersContext';

// from https://vercel.com/guides/react-context-state-management-nextjs

export function Providers({ children }: any) {
  return (
    <PersProvider>
      {children}
    </PersProvider>
  );
}