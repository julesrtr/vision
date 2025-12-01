"use client";

import { useState, useEffect, useRef } from "react";

export default function Mascot() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  // Track Mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Blinking Logic
  useEffect(() => {
    const blinkLoop = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150); // Blink duration

      // Random interval between 2s and 6s
      const nextBlink = Math.random() * 4000 + 2000;
      setTimeout(blinkLoop, nextBlink);
    };
    
    const timer = setTimeout(blinkLoop, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate Pupil Position
  const getPupilStyle = (eyeRef: React.RefObject<HTMLDivElement | null>) => {
    if (!eyeRef.current) return {};

    const eyeRect = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;

    // Angle to mouse
    const angle = Math.atan2(mousePos.y - eyeCenterY, mousePos.x - eyeCenterX);
    
    // Distance (limit movement radius)
    const distance = Math.min(
      4, // Max radius in px
      Math.hypot(mousePos.x - eyeCenterX, mousePos.y - eyeCenterY) / 10
    );

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { transform: `translate(${x}px, ${y}px)` };
  };

  return (
    <div className="fixed bottom-20 right-8 w-32 h-32 z-0 pointer-events-none select-none hidden md:block">
      {/* CRT Body */}
      <div className="relative w-full h-full">
        {/* Monitor Housing */}
        <div className="absolute inset-0 bg-[#e0e0e0] border-[3px] border-black rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
           {/* Screen Bezel */}
           <div className="absolute inset-2 bg-[#a0a0a0] border-[2px] border-black rounded">
              {/* Screen */}
              <div className="absolute inset-1 bg-[#2b2b2b] border-[2px] border-black overflow-hidden flex items-center justify-center gap-4">
                 
                 {/* Scanlines */}
                 <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-50" />

                 {/* Left Eye */}
                 <div ref={leftEyeRef} className={`relative w-6 h-8 bg-black rounded-full flex items-center justify-center transition-all duration-100 ${isBlinking ? 'h-[2px] scale-y-0 bg-pop-lime' : ''}`}>
                    {!isBlinking && (
                        <div 
                          className="w-2 h-2 bg-pop-lime rounded-full shadow-[0_0_5px_#7aff59]"
                          style={getPupilStyle(leftEyeRef)}
                        />
                    )}
                 </div>

                 {/* Right Eye */}
                 <div ref={rightEyeRef} className={`relative w-6 h-8 bg-black rounded-full flex items-center justify-center transition-all duration-100 ${isBlinking ? 'h-[2px] scale-y-0 bg-pop-lime' : ''}`}>
                    {!isBlinking && (
                        <div 
                          className="w-2 h-2 bg-pop-lime rounded-full shadow-[0_0_5px_#7aff59]"
                          style={getPupilStyle(rightEyeRef)}
                        />
                    )}
                 </div>

              </div>
           </div>
        </div>
        
        {/* Monitor Stand */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#c0c0c0] border-[3px] border-black rounded-b-lg -z-10 shadow-[4px_4px_0px_rgba(0,0,0,0.5)]" />
      </div>
    </div>
  );
}
