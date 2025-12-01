"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface CrtSwitchProps {
  onComplete: () => void;
}

export default function CrtSwitch({ onComplete }: CrtSwitchProps) {
  const [phase, setPhase] = useState<"line" | "expand" | "fade">("line");

  useEffect(() => {
    // Sequence the animation phases
    const lineTimer = setTimeout(() => setPhase("expand"), 400);
    const expandTimer = setTimeout(() => setPhase("fade"), 1000);
    const completeTimer = setTimeout(onComplete, 1500);

    return () => {
      clearTimeout(lineTimer);
      clearTimeout(expandTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black overflow-hidden">
      <AnimatePresence>
        {phase === "line" && (
          <motion.div
            initial={{ width: 0, height: "2px", opacity: 1 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white shadow-[0_0_20px_white]"
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {phase === "expand" && (
          <motion.div
            initial={{ width: "100%", height: "2px" }}
            animate={{ height: "100vh" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-white absolute"
          />
        )}
      </AnimatePresence>

      {/* Optional Flash Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "fade" ? 0 : phase === "expand" ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        className="absolute inset-0 bg-white"
      />
    </div>
  );
}

