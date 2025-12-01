import Draggable from "react-draggable";
import { X, Minus, Square, Maximize2 } from "lucide-react";
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WindowProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
  onFocus: () => void;
  defaultPosition?: { x: number; y: number };
}

export default function Window({ 
  title, 
  children, 
  isOpen, 
  onClose,
  onMinimize,
  onMaximize,
  isMinimized,
  isMaximized,
  isActive, 
  onFocus,
  defaultPosition = { x: 100, y: 100 } 
}: WindowProps) {
  const nodeRef = useRef(null);

  if (!isOpen) return null;

  // Animation variants
  const variants = {
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.2 }
    },
    minimized: { 
      opacity: 0, 
      scale: 0.1, 
      y: -200, // Fly up towards top bar
      x: -200, // Towards left (start button area approximately)
      transition: { duration: 0.3 }
    },
    maximized: {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        position: "fixed" as const
    }
  };

  // If maximized, we disable dragging
  const DraggableWrapper = isMaximized ? 'div' : Draggable;
  const draggableProps = isMaximized 
    ? { className: "fixed inset-0 z-40 p-0" } // Maximized container
    : { 
        handle: ".window-header", 
        defaultPosition, 
        nodeRef, 
        onMouseDown: onFocus 
      };

  return (
    <AnimatePresence>
      {!isMinimized && (
        <DraggableWrapper {...draggableProps}>
          <motion.div 
            ref={nodeRef}
            initial="visible"
            animate={isMaximized ? { top: 0, left: 0, width: "100%", height: "100%", x: 0, y: 0 } : "visible"}
            exit="minimized"
            className={`
                absolute bg-white border-[3px] border-pop-border shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col
                ${isActive ? 'z-30' : 'z-10'}
                ${isMaximized ? 'w-full h-full rounded-none shadow-none border-0' : 'w-[500px] rounded-none'}
            `}
          >
            {/* Header - Bold Pop Style */}
            <div 
                className={`window-header h-10 flex items-center justify-between px-2 cursor-grab active:cursor-grabbing border-b-[3px] border-pop-border shrink-0 ${isActive ? 'bg-pop-purple' : 'bg-pop-cyan'}`}
                onDoubleClick={onMaximize}
            >
              
              {/* Title */}
              <div className="flex items-center gap-2 pl-1">
                 <span className="font-retro-ui text-base font-bold text-white select-none tracking-wide drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]" style={{ textShadow: '2px 2px 0px #000' }}>
                  {title}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2" onMouseDown={(e) => e.stopPropagation()}>
                <button 
                    onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                    className="w-6 h-6 flex items-center justify-center bg-white border-[2px] border-black hover:bg-gray-100 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
                >
                    <Minus size={14} strokeWidth={3} />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onMaximize(); }}
                    className="w-6 h-6 flex items-center justify-center bg-white border-[2px] border-black hover:bg-gray-100 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
                >
                    {isMaximized ? <Square size={10} strokeWidth={3} /> : <Maximize2 size={12} strokeWidth={3} />}
                </button>
                 <button 
                   className="w-6 h-6 flex items-center justify-center bg-pop-pink border-[2px] border-black hover:bg-red-400 text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
                   onClick={(e) => {
                     e.stopPropagation();
                     onClose();
                   }}
                 >
                   <X size={16} strokeWidth={4} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white relative overflow-auto">
               {/* Inner Grid Pattern - Only show if not blocked by content */}
               <div className="absolute inset-0 opacity-10 pointer-events-none z-0" 
                 style={{ 
                   backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                   backgroundSize: '20px 20px'
                 }} 
               />
               <div className="relative z-10 h-full">
                 {children}
               </div>
            </div>
            
            {/* Status Bar - Optional decorative stripes */}
            {!isMaximized && (
                <div className="h-3 bg-pop-yellow border-t-[3px] border-pop-border flex shrink-0">
                    {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-[2px] h-full bg-black mx-1" />
                    ))}
                </div>
            )}
          </motion.div>
        </DraggableWrapper>
      )}
    </AnimatePresence>
  );
}
