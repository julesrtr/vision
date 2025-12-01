"use client";

import { Play } from "lucide-react";
import { useState, useEffect } from "react";

interface TopBarProps {
  openWindows: { id: string; title: string; isMinimized: boolean; isActive: boolean }[];
  onWindowClick: (id: string) => void;
  onStartClick?: () => void;
}

export default function TopBar({ openWindows = [], onWindowClick, onStartClick }: TopBarProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-12 bg-pop-cyan border-t-[3px] border-black flex items-center px-2 justify-between select-none font-retro-ui text-sm z-50 relative">
      <div className="flex items-center gap-4 overflow-hidden h-full flex-1">
        {/* Start Button */}
        <div 
          onClick={onStartClick}
          className="font-bold cursor-pointer bg-white border-[2px] border-black px-4 py-1 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none transition-all flex items-center gap-2 shrink-0"
        >
          <Play size={16} className="fill-black" />
          <span className="uppercase tracking-wider">Start</span>
        </div>

        {/* Divider */}
        <div className="w-[2px] h-8 bg-black shrink-0" />

        {/* Open Windows (Taskbar Items) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar h-full py-1 pr-4 flex-1">
           {openWindows.map((win) => (
             <button
               key={win.id}
               onClick={() => onWindowClick(win.id)}
               className={`
                 px-3 py-1 border-[2px] border-black font-bold text-xs truncate max-w-[150px] shrink-0
                 ${win.isActive && !win.isMinimized
                    ? 'bg-white text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] translate-x-[1px] translate-y-[1px]' // Pressed in look or active
                    : 'bg-pop-purple text-white shadow-[4px_4px_0px_rgba(0,0,0,1)]' // Inactive look
                 }
               `}
             >
               {win.title}
             </button>
           ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2 shrink-0 pl-2">
         <div className="font-mono font-bold text-black bg-white border-[2px] border-black px-4 py-1 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            {time}
         </div>
      </div>
    </div>
  );
}
