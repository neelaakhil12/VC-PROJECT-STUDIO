import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [text, setText] = useState('');
  const fullText = 'PROJECT STUDIO';
  const [fadeExit, setFadeExit] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        
        // Wait shortly after text is typed, then trigger fade out
        setTimeout(() => {
          setFadeExit(true);
          
          // Complete splash screen after transition duration (1000ms)
          setTimeout(() => {
            onComplete();
          }, 1000);
        }, 1000);
      }
    }, 120);

    return () => clearInterval(typingInterval);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 bg-[#0c0c0c] z-50 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
        fadeExit ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated premium logo */}
        <img 
          src="/logo.png" 
          alt="Project Studio Logo" 
          className="w-28 h-28 object-cover rounded-lg border border-gold/40 shadow-gold-lg animate-pulse" 
        />
        
        {/* Typewriter text holder */}
        <div className="flex items-center justify-center min-h-[36px] w-full px-4">
          <span className="font-heading text-lg sm:text-2xl md:text-3xl font-bold tracking-[0.2em] sm:tracking-[0.3em] text-gold text-shadow-premium text-center block w-full">
            {text}
          </span>
        </div>
        
        <span className="text-[10px] uppercase tracking-[0.35em] text-white/50 font-poppins mt-[-4px]">
          Premium Interiors
        </span>
      </div>
    </div>
  );
}
