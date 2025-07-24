'use client';

import { useEffect, useState } from 'react';
import OfflinePage from '../OfflinePage';

export default function OfflineWrapper({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkInternetConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 sec timeout

        const response = await fetch('/favicon.ico', { method: 'HEAD', signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      } catch (error) {
        setIsOnline(false);
      }
    };

    // Check immediately on mount
    checkInternetConnection();

    // Set up listeners for fast offline detection
    const handleOnline = () => checkInternetConnection();
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic ping every 5 seconds for reliability
    interval = setInterval(checkInternetConnection, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!isOnline) {
    return <OfflinePage />;
  }

  return <>{children}</>;
}
