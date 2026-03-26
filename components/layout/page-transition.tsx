'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export function PageTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Track the target URL we're navigating to
  const targetUrlRef = useRef<string | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Clear all timers
  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  // Complete the loading animation
  const completeLoading = () => {
    clearTimers();
    setProgress(100);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
      targetUrlRef.current = null;
    }, 300);
    timersRef.current.push(timer);
  };

  // Current URL for comparison
  const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

  // Complete loading when we reach the target URL
  useEffect(() => {
    if (isLoading && targetUrlRef.current) {
      // Check if we've arrived at the destination
      if (currentUrl === targetUrlRef.current || pathname === targetUrlRef.current) {
        completeLoading();
      }
    }
  }, [currentUrl, pathname, isLoading]);

  // Listen for link clicks to start loading
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor) {
        const href = anchor.getAttribute('href');
        const isExternal = anchor.target === '_blank' || anchor.rel?.includes('external');
        const isHashLink = href?.startsWith('#');
        const isDownload = anchor.hasAttribute('download');
        const isSameUrl = href === currentUrl || href === pathname;

        // Only trigger for internal navigation links
        if (href && !isExternal && !isHashLink && !isDownload && !isSameUrl && href.startsWith('/')) {
          // Store the target URL
          targetUrlRef.current = href;

          // Start loading animation
          clearTimers();
          setIsLoading(true);
          setProgress(0);

          // Animate progress incrementally
          const t1 = setTimeout(() => setProgress(20), 50);
          const t2 = setTimeout(() => setProgress(40), 150);
          const t3 = setTimeout(() => setProgress(60), 300);
          const t4 = setTimeout(() => setProgress(80), 500);

          // Safety timeout - complete after 5 seconds max
          const safetyTimer = setTimeout(() => {
            completeLoading();
          }, 5000);

          timersRef.current.push(t1, t2, t3, t4, safetyTimer);
        }
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      clearTimers();
    };
  }, [currentUrl, pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, []);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent pointer-events-none">
      <div
        className={cn(
          'h-full bg-gradient-to-r from-primary via-blue-500 to-primary transition-all ease-out',
          progress === 100 ? 'duration-200' : 'duration-300'
        )}
        style={{
          width: `${progress}%`,
          opacity: progress > 0 ? 1 : 0,
        }}
      />
      {/* Shimmer effect */}
      {isLoading && progress < 100 && (
        <div
          className="absolute top-0 h-full w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{
            left: `calc(${Math.min(progress, 90)}% - 64px)`,
            animation: 'shimmer 1s ease-in-out infinite',
          }}
        />
      )}
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
