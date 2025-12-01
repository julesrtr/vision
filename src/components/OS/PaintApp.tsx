"use client";

import { useState, useRef, useEffect } from "react";
import { Eraser, Pencil, Square, Circle, Trash2 } from "lucide-react";

export default function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [tool, setTool] = useState<"pencil" | "eraser">("pencil");
  const [lineWidth, setLineWidth] = useState(3);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match parent container
    const parent = canvas.parentElement;
    if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
    }
    
    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = tool === "eraser" ? 20 : lineWidth;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#c0c0c0]">
      {/* Toolbar */}
      <div className="h-10 bg-[#e0e0e0] border-b border-gray-400 flex items-center px-2 gap-2 shrink-0">
        <button 
            onClick={() => setTool("pencil")}
            className={`p-1 border ${tool === "pencil" ? "bg-white border-black inset-shadow" : "border-transparent hover:border-gray-400"}`}
        >
            <Pencil size={16} />
        </button>
        <button 
            onClick={() => setTool("eraser")}
            className={`p-1 border ${tool === "eraser" ? "bg-white border-black inset-shadow" : "border-transparent hover:border-gray-400"}`}
        >
            <Eraser size={16} />
        </button>
        <div className="w-[1px] h-6 bg-gray-400 mx-1" />
        
        {/* Colors */}
        <div className="flex gap-1">
            {['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map(c => (
                <button
                    key={c}
                    onClick={() => { setColor(c); setTool("pencil"); }}
                    className={`w-5 h-5 border border-gray-600 ${color === c && tool === 'pencil' ? 'ring-1 ring-black' : ''}`}
                    style={{ backgroundColor: c }}
                />
            ))}
        </div>
        
        <div className="flex-1" />
        <button onClick={clearCanvas} className="p-1 text-red-600 hover:bg-red-100 rounded">
            <Trash2 size={16} />
        </button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden bg-gray-500 p-4">
          <div className="w-full h-full shadow-[4px_4px_0px_rgba(0,0,0,0.2)] bg-white">
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-full cursor-crosshair block"
            />
          </div>
      </div>
    </div>
  );
}

