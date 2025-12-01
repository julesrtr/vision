import { MouseEventHandler } from "react";

interface DesktopIconProps {
  label: string;
  icon: React.ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
}

export default function DesktopIcon({ label, icon, onClick, onDoubleClick, selected }: DesktopIconProps) {
  return (
    <div 
      className="flex flex-col items-center gap-2 w-28 cursor-pointer group"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className={`p-2 transition-transform active:scale-95 ${selected ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}`}>
        {icon}
      </div>
      <span 
        className={`
          px-2 py-1 text-xs font-bold font-retro-ui text-center border-[2px] shadow-[2px_2px_0px_rgba(0,0,0,1)]
          ${selected 
            ? 'bg-pop-pink text-white border-black' 
            : 'bg-white text-black border-black group-hover:bg-gray-50'
          }
        `}
      >
        {label}
      </span>
    </div>
  );
}
