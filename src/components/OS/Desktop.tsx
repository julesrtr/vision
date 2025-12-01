"use client";

import { useState } from "react";
import { Folder, FileText, Trash2, HardDrive, Gamepad2, Lock, Unlock, Palette, HelpCircle, Video } from "lucide-react";
import TopBar from "./TopBar";
import DesktopIcon from "./DesktopIcon";
import Window from "./Window";
import SnakeGame from "./SnakeGame";
import PaintApp from "./PaintApp";
import Mascot from "./Mascot";
import { initialFileSystem, FileSystemItem } from "@/data/filesystem";

export default function Desktop() {
  // Extended Window State
  const [windows, setWindows] = useState<{ 
      id: string; 
      item: FileSystemItem;
      isMinimized: boolean;
      isMaximized: boolean;
  }[]>([]);
  
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [fileSystem, setFileSystem] = useState(initialFileSystem);

  const unlockSecret = () => {
    setFileSystem(prev => prev.map(item => {
      if (item.id === 'secret_file') {
        return { ...item, type: 'video', locked: false, name: 'VIDEO +18.mp4', content: 'zZ6vybT1HQs' };
      }
      return item;
    }));
  };

  const openWindow = (item: FileSystemItem) => {
    if (item.locked) {
      alert("ACCESS DENIED. Win Snake game to unlock.");
      return;
    }

    const existingWindow = windows.find((w) => w.id === item.id);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
          toggleMinimize(item.id);
      }
      setActiveWindowId(item.id);
      return;
    }
    
    setWindows([...windows, { 
        id: item.id, 
        item, 
        isMinimized: false,
        isMaximized: false
    }]);
    setActiveWindowId(item.id);
  };

  const openMyPC = () => {
    // Create a special filesystem item for My PC that contains everything
    const myPCItem: FileSystemItem = {
        id: 'my_pc',
        name: 'My PC',
        type: 'folder',
        children: fileSystem
    };
    openWindow(myPCItem);
  };

  const openTutorial = () => {
    const tutorialItem: FileSystemItem = {
        id: 'tutorial',
        name: 'Tutorial',
        type: 'text',
        content: `WELCOME TO VISION OS v1.0\n\nGUIDE:\n1. Double-click icons to open applications or files.\n2. Drag windows to organize your workspace.\n3. Use the maximize/minimize buttons in the top-right of windows.\n4. 'My PC' shows all your files in one place.\n5. Win the Snake game to unlock the secret file!\n\nEnjoy exploring!\n\n- Jules`
    };
    openWindow(tutorialItem);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const toggleMinimize = (id: string) => {
      setWindows(windows.map(w => {
          if (w.id === id) {
              return { ...w, isMinimized: !w.isMinimized };
          }
          return w;
      }));
      
      // If we just minimized the active window, unset active
      if (activeWindowId === id) {
          const win = windows.find(w => w.id === id);
          if (!win?.isMinimized) { // If it WAS active and we are minimizing it
               setActiveWindowId(null);
          } else {
               setActiveWindowId(id); // Restoring
          }
      } else {
          // If restoring a background window, make it active
          setActiveWindowId(id);
      }
  };

  const toggleMaximize = (id: string) => {
      setWindows(windows.map(w => {
          if (w.id === id) {
              return { ...w, isMaximized: !w.isMaximized };
          }
          return w;
      }));
      setActiveWindowId(id);
  };

  // Custom Vaporwave Icon Styles
  const getIcon = (type: string, locked: boolean = false) => {
    const commonProps = { size: 40, strokeWidth: 2, className: "drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]" };
    
    if (locked) return <Lock {...commonProps} className={`${commonProps.className} text-red-500 fill-red-100`} />;
    
    switch (type) {
      case "folder": return <Folder {...commonProps} className={`${commonProps.className} text-black fill-pop-yellow`} />;
      case "text": return <FileText {...commonProps} className={`${commonProps.className} text-black fill-white`} />;
      case "trash": return <Trash2 {...commonProps} className={`${commonProps.className} text-black fill-pop-pink`} />;
      case "app": 
         return <Gamepad2 {...commonProps} className={`${commonProps.className} text-black fill-pop-lime`} />;
      case "locked": return <Lock {...commonProps} className={`${commonProps.className} text-red-500 fill-red-100`} />;
      case "video": return <Video {...commonProps} className={`${commonProps.className} text-black fill-pop-cyan`} />;
      default: return <FileText {...commonProps} className={`${commonProps.className} text-black fill-white`} />;
    }
  };

  const getIconForItem = (item: FileSystemItem) => {
      if (item.id === 'paint_app') {
           const commonProps = { size: 40, strokeWidth: 2, className: "drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]" };
           return <Palette {...commonProps} className={`${commonProps.className} text-black fill-pop-pink`} />;
      }
      if (item.id === 'tutorial') {
           const commonProps = { size: 40, strokeWidth: 2, className: "drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]" };
           return <HelpCircle {...commonProps} className={`${commonProps.className} text-black fill-pop-cyan`} />;
      }
      return getIcon(item.type, item.locked);
  }

  const renderWindowContent = (item: FileSystemItem) => {
    if (item.type === "app") {
        if (item.id === "snake_game") return <SnakeGame onWin={unlockSecret} />;
        if (item.id === "paint_app") return <PaintApp />;
    }

    if (item.type === "folder") {
      return (
        <div className="grid grid-cols-4 gap-6 p-4">
          {item.children?.map((child) => (
            <DesktopIcon
              key={child.id}
              label={child.name}
              icon={getIconForItem(child)}
              onClick={(e) => {
                e?.stopPropagation();
                setSelectedIconId(child.id);
              }}
              onDoubleClick={() => openWindow(child)}
              selected={selectedIconId === child.id}
            />
          ))}
          {item.children?.length === 0 && (
             <div className="text-gray-400 text-sm col-span-4 text-center mt-10 italic">Empty folder</div>
          )}
        </div>
      );
    } else if (item.type === "video") {
        return (
            <div className="w-full h-full bg-black flex items-center justify-center">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${item.content}?autoplay=1`}
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
            </div>
        );
    } else {
      return (
        // Translucent background for text files so we can see the grid pattern
        <div className="whitespace-pre-wrap font-mono text-sm p-4 text-black bg-white/50 h-full">
          {item.content}
        </div>
      );
    }
  };

  return (
    <div 
      className="h-screen w-full overflow-hidden flex flex-col relative font-retro-ui cursor-default select-none bg-[#00a8a8]" 
      style={{ 
        backgroundImage: `
          linear-gradient(#7fffd4 1px, transparent 1px), 
          linear-gradient(90deg, #7fffd4 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
    >
      <div className="flex-1 relative p-4 flex flex-col gap-4 flex-wrap content-start" onClick={() => setSelectedIconId(null)}>
        
        {/* Credits / Design By - Background Text */}
        <div className="absolute top-4 right-4 z-0 pointer-events-none text-right">
           <h1 className="text-3xl md:text-5xl text-white drop-shadow-[2px_2px_0px_#000] opacity-40 font-retro-mono leading-none tracking-tight">
             DESIGN BY<br/>JULES ROUTIER
           </h1>
        </div>

        {/* Desktop Icons */}
        <div className="absolute left-4 top-4 flex flex-col gap-8 items-start z-10">
           <DesktopIcon 
             label="My PC" 
             icon={<HardDrive size={40} strokeWidth={2} className="text-black fill-pop-cyan drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]" />} 
             onClick={(e) => {
                e?.stopPropagation();
                setSelectedIconId('hd');
             }}
             onDoubleClick={openMyPC}
             selected={selectedIconId === 'hd'}
           />
           {fileSystem.map((item) => (
            <DesktopIcon
              key={item.id}
              label={item.name}
              icon={getIconForItem(item)}
              onClick={(e) => {
                e?.stopPropagation();
                setSelectedIconId(item.id);
              }}
              onDoubleClick={() => openWindow(item)}
              selected={selectedIconId === item.id}
            />
           ))}
        </div>

        {/* Mascot */}
        <Mascot />

        {/* Windows */}
        {windows.map((win) => (
          <Window
            key={win.id}
            title={win.item.name}
            isOpen={true}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => toggleMinimize(win.id)}
            onMaximize={() => toggleMaximize(win.id)}
            isMinimized={win.isMinimized}
            isMaximized={win.isMaximized}
            isActive={activeWindowId === win.id}
            onFocus={() => setActiveWindowId(win.id)}
            defaultPosition={{ x: 150 + windows.indexOf(win) * 40, y: 100 + windows.indexOf(win) * 40 }}
          >
            {renderWindowContent(win.item)}
          </Window>
        ))}
      </div>

      {/* Taskbar at Bottom */}
      <TopBar 
          openWindows={windows.map(w => ({ 
              id: w.id, 
              title: w.item.name, 
              isMinimized: w.isMinimized,
              isActive: activeWindowId === w.id 
          }))}
          onWindowClick={(id) => {
             const win = windows.find(w => w.id === id);
             if (win) {
                 if (win.isMinimized) toggleMinimize(id);
                 else if (activeWindowId === id) toggleMinimize(id); 
                 else setActiveWindowId(id);
             }
          }}
          onStartClick={openTutorial}
      />
    </div>
  );
}
