import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition() {
  const location = useLocation();
  const [display, setDisplay] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      // Trigger transition layout
      setDisplay(true);
      setIsAnimating(false);

      // Trigger the slide-open transition after a minor frame delay (GPU painting)
      const openTimer = setTimeout(() => {
        setIsAnimating(true);
      }, 50);

      // De-allocate transition container from DOM after animation completes (750ms total)
      const hideTimer = setTimeout(() => {
        setDisplay(false);
      }, 750);

      previousPath.current = location.pathname;
      return () => {
        clearTimeout(openTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [location.pathname]);

  if (!display) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden select-none">
      {/* Left Door */}
      <div 
        className={`absolute top-0 left-0 w-1/2 h-full bg-[#0D0D0D] border-r border-[#D4AF37]/20 flex items-center justify-end transition-transform duration-700 will-change-transform ${
          isAnimating ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.85, 0, 0.15, 1)' }}
      >
        <div className={`translate-x-1/2 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-16 h-16 border border-[#D4AF37]/40 rounded-full flex items-center justify-center bg-[#0D0D0D] text-[#D4AF37] font-heading text-2xl font-bold shadow-[0_0_15px_rgba(212,175,55,0.15)] mr-[-32px] select-none">
            P
          </div>
        </div>
      </div>

      {/* Right Door */}
      <div 
        className={`absolute top-0 right-0 w-1/2 h-full bg-[#0D0D0D] border-l border-[#D4AF37]/20 flex items-center justify-start transition-transform duration-700 will-change-transform ${
          isAnimating ? 'translate-x-full' : 'translate-x-0'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.85, 0, 0.15, 1)' }}
      >
        <div className={`-translate-x-1/2 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-16 h-16 border border-[#D4AF37]/40 rounded-full flex items-center justify-center bg-[#0D0D0D] text-[#D4AF37] font-heading text-2xl font-bold shadow-[0_0_15px_rgba(212,175,55,0.15)] ml-[-32px] select-none">
            S
          </div>
        </div>
      </div>
    </div>
  );
}
