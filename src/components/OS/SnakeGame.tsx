"use client";

import { useState, useEffect, useCallback } from "react";
import { Apple } from "lucide-react";

const GRID_SIZE = 20;
const CELL_SIZE = 20; // px
const INITIAL_SNAKE = [[5, 5]];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const WIN_SCORE = 10;

interface SnakeGameProps {
  onWin: () => void;
}

export default function SnakeGame({ onWin }: SnakeGameProps) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 10, y: 10 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Generate random food
  const spawnFood = useCallback(() => {
    let newX, newY;
    let isCollision;
    
    do {
      newX = Math.floor(Math.random() * GRID_SIZE);
      newY = Math.floor(Math.random() * GRID_SIZE);
      
      // Prevent spawning on snake
      isCollision = snake.some(segment => segment[0] === newX && segment[1] === newY);
    } while (isCollision);
    
    setFood({ x: newX, y: newY });
  }, [snake]);

  // Game Loop
  useEffect(() => {
    if (gameOver || gameWon || isPaused) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const currentHead = prevSnake[0];
        let newHeadX = currentHead[0] + direction.x;
        let newHeadY = currentHead[1] + direction.y;

        // Wall Wrapping (Teleport) logic
        if (newHeadX < 0) newHeadX = GRID_SIZE - 1;
        if (newHeadX >= GRID_SIZE) newHeadX = 0;
        if (newHeadY < 0) newHeadY = GRID_SIZE - 1;
        if (newHeadY >= GRID_SIZE) newHeadY = 0;

        const newHead = { x: newHeadX, y: newHeadY };

        // Check Self Collision
        for (let i = 0; i < prevSnake.length; i++) {
             // Ignore tail if it's moving away, but simplier to just check all
             if (i === prevSnake.length - 1) continue; // Tail will move
             if (newHead.x === prevSnake[i][0] && newHead.y === prevSnake[i][1]) {
               setGameOver(true);
               return prevSnake;
             }
        }

        const newSnake = [[newHead.x, newHead.y], ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 1);
          spawnFood();
          // Grow snake: don't pop tail
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 120); // Slightly faster for better feel

    return () => clearInterval(interval);
  }, [direction, food, gameOver, gameWon, isPaused, spawnFood]);

  // Win Condition Effect
  useEffect(() => {
    if (score >= WIN_SCORE && !gameWon) {
        setGameWon(true);
        onWin();
    }
  }, [score, gameWon, onWin]);

  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  const restart = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    // Initial food spawn might need reset logic or just let it be random
    // But we need to make sure it doesn't spawn on the initial snake pos
    setFood({ x: 10, y: 10 }); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#2b2b2b] p-4 select-none font-mono">
      <div className="mb-2 flex justify-between w-full max-w-[400px] text-green-400">
        <span>SCORE: {score}</span>
        <span>GOAL: {WIN_SCORE}</span>
      </div>
      
      <div 
        className="relative border-4 border-gray-600 bg-[#1a1a1a] shadow-lg overflow-hidden"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {/* Grid Background (Optional for better look) */}
        <div className="absolute inset-0 opacity-5" 
             style={{ 
               backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
               backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
             }} 
        />

        {/* Food - Apple Icon */}
        <div
          className="absolute flex items-center justify-center text-red-500"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        >
           <Apple size={16} fill="currentColor" />
        </div>

        {/* Snake */}
        {snake.map((segment, i) => {
           const isHead = i === 0;
           return (
            <div
                key={`${segment[0]}-${segment[1]}-${i}`}
                className={`absolute ${isHead ? 'z-10' : 'z-0'}`}
                style={{
                left: segment[0] * CELL_SIZE,
                top: segment[1] * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                }}
            >
                <div 
                  className={`w-full h-full ${isHead ? 'bg-green-400' : 'bg-green-600'} border-[1px] border-[#1a1a1a] rounded-sm`}
                />
                {/* Snake Eyes for Head */}
                {isHead && (
                    <>
                        <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full" />
                        <div className="absolute top-1 right-1 w-1 h-1 bg-black rounded-full" />
                    </>
                )}
            </div>
           );
        })}

        {/* Overlays */}
        {(gameOver || gameWon) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-4 text-center z-50">
            {gameWon ? (
               <>
                 <h2 className="text-2xl text-green-400 font-bold mb-2 animate-pulse">ACCESS GRANTED</h2>
                 <p className="text-sm mb-4">Secret file unlocked on desktop.</p>
               </>
            ) : (
               <>
                 <h2 className="text-2xl text-red-500 font-bold mb-2">GAME OVER</h2>
               </>
            )}
            <button 
              onClick={restart}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm border border-gray-500 transition-colors"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Use Arrow Keys to Move<br/>
        Wall Wrapping Enabled
      </div>
    </div>
  );
}
