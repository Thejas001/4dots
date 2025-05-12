// File: components/OfflineWrapper.tsx

'use client';

import { useEffect, useState } from 'react';
import OfflinePage from '../OfflinePage';

export default function OfflineWrapper({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  if (!isOnline) {
    return <OfflinePage />;
  }

  return <>{children}</>;
}
