"use client";

import { useState } from "react";
import IntroVideo from "@/components/Intro/IntroVideo";
import CrtSwitch from "@/components/Effects/CrtSwitch";
import Desktop from "@/components/OS/Desktop";

export default function Home() {
  const [phase, setPhase] = useState<"intro" | "boot" | "desktop">("intro");

  return (
    <main className="relative w-full min-h-screen overflow-hidden">
      {phase === "intro" && (
        <IntroVideo 
          src="/assets/intro.mp4" 
          onFinish={() => setPhase("boot")} 
        />
      )}

      {phase === "boot" && (
        <CrtSwitch onComplete={() => setPhase("desktop")} />
      )}

      {phase === "desktop" && (
        <Desktop />
      )}
      
      {/* Debug/Dev Skip Button (Hidden in production ideally, or removed) */}
      {/* <button className="fixed top-0 left-0 z-[100] bg-red-500 text-white p-2" onClick={() => setPhase("desktop")}>Skip</button> */}
    </main>
  );
}
