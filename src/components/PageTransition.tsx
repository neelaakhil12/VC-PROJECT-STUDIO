import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition() {
  const location = useLocation();
  const [display, setDisplay] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [clonedHtml, setClonedHtml] = useState('');
  const [scrollPos, setScrollPos] = useState(0);
  const previousPath = useRef(location.pathname);

  // Set up global click listener to capture the old page HTML before React Router updates the DOM
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        // Only capture relative links or same-origin links
        if (href && (href.startsWith('/') || href.startsWith(window.location.origin))) {
          const mainEl = document.querySelector('main');
          if (mainEl) {
            (window as any).sharedTransitionHtml = mainEl.innerHTML;
            (window as any).sharedTransitionScroll = window.scrollY;
          }
        }
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  // Handle route change transition trigger
  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      const sharedHtml = (window as any).sharedTransitionHtml;
      const sharedScroll = (window as any).sharedTransitionScroll || 0;

      if (sharedHtml) {
        setClonedHtml(sharedHtml);
        setScrollPos(sharedScroll);
        setDisplay(true);
        setIsAnimating(false);

        // Clear global storage to prevent duplicate runs
        delete (window as any).sharedTransitionHtml;
        delete (window as any).sharedTransitionScroll;

        // Trigger transition shortly after rendering closed doors
        const openTimer = setTimeout(() => {
          setIsAnimating(true);
        }, 80);

        // Hide overlay after animation finishes (800ms transition + 80ms delay)
        const hideTimer = setTimeout(() => {
          setDisplay(false);
          setClonedHtml('');
        }, 900);

        previousPath.current = location.pathname;
        return () => {
          clearTimeout(openTimer);
          clearTimeout(hideTimer);
        };
      } else {
        // Fallback black logo doors if navigated without a click (e.g. back/forward button)
        setDisplay(true);
        setIsAnimating(false);

        const openTimer = setTimeout(() => {
          setIsAnimating(true);
        }, 100);

        const hideTimer = setTimeout(() => {
          setDisplay(false);
        }, 850);

        previousPath.current = location.pathname;
        return () => {
          clearTimeout(openTimer);
          clearTimeout(hideTimer);
        };
      }
    }
  }, [location.pathname]);

  if (!display) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden select-none">
      {clonedHtml ? (
        <>
          {/* Left Door - displays left half of captured screen */}
          <div 
            className={`absolute top-0 left-0 w-1/2 h-full overflow-hidden bg-offwhite border-r border-gold/20 transition-transform duration-800 cubic-bezier(0.25, 1, 0.5, 1) ${
              isAnimating ? '-translate-x-full' : 'translate-x-0'
            }`}
          >
            <div 
              className="absolute top-0 left-0 h-screen overflow-hidden"
              style={{ 
                width: '100vw',
                minWidth: '100vw',
                transform: `translateY(-${scrollPos}px)`
              }}
              dangerouslySetInnerHTML={{ __html: clonedHtml }}
            />
            {/* Subtle overlay to enhance sliding depth */}
            <div className={`absolute inset-0 bg-black/10 transition-opacity duration-700 ${isAnimating ? 'opacity-0' : 'opacity-100'}`} />
          </div>

          {/* Right Door - displays right half of captured screen */}
          <div 
            className={`absolute top-0 right-0 w-1/2 h-full overflow-hidden bg-offwhite border-l border-gold/20 transition-transform duration-800 cubic-bezier(0.25, 1, 0.5, 1) ${
              isAnimating ? 'translate-x-full' : 'translate-x-0'
            }`}
          >
            <div 
              className="absolute top-0 right-0 h-screen overflow-hidden"
              style={{ 
                width: '100vw',
                minWidth: '100vw',
                transform: `translateY(-${scrollPos}px)`
              }}
              dangerouslySetInnerHTML={{ __html: clonedHtml }}
            />
            <div className={`absolute inset-0 bg-black/10 transition-opacity duration-700 ${isAnimating ? 'opacity-0' : 'opacity-100'}`} />
          </div>
        </>
      ) : (
        <>
          {/* Fallback Black Emblem Doors */}
          <div 
            className={`absolute top-0 left-0 w-1/2 h-full bg-[#0a0a0a] border-r border-gold/15 flex items-center justify-end transition-transform duration-700 ease-in-out ${
              isAnimating ? '-translate-x-full' : 'translate-x-0'
            }`}
          >
            <div className={`translate-x-1/2 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-16 h-16 border border-gold rounded-full flex items-center justify-center bg-[#0a0a0a] text-gold font-heading text-2xl font-bold shadow-gold-glow mr-[-32px]">
                P
              </div>
            </div>
          </div>

          <div 
            className={`absolute top-0 right-0 w-1/2 h-full bg-[#0a0a0a] border-l border-gold/15 flex items-center justify-start transition-transform duration-700 ease-in-out ${
              isAnimating ? 'translate-x-full' : 'translate-x-0'
            }`}
          >
            <div className={`-translate-x-1/2 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-16 h-16 border border-gold rounded-full flex items-center justify-center bg-[#0a0a0a] text-gold font-heading text-2xl font-bold shadow-gold-glow ml-[-32px]">
                S
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
