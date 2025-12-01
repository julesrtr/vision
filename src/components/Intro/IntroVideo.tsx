"use client";

import { useEffect, useRef } from "react";

interface IntroVideoProps {
  src: string;
  onFinish: () => void;
}

export default function IntroVideo({ src, onFinish }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt to play immediately
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Autoplay prevented:", error);
        // Show a "Click to start" button if needed, or just let the user click? 
        // For now, we rely on 'muted' to allow autoplay.
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        muted
        playsInline
        onEnded={onFinish}
      />
      {/* Optional Skip Button */}
      <button 
        onClick={onFinish}
        className="absolute bottom-8 right-8 text-white/50 hover:text-white text-sm font-mono border border-white/20 px-3 py-1 rounded hover:bg-white/10 transition-colors"
      >
        SKIP_INTRO
      </button>
    </div>
  );
}





