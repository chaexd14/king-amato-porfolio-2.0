"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, RefreshCw, Play, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Gamepad2 } from "lucide-react";

interface SnakeGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };
type ScorePopup = { x: number; y: number; id: number; opacity: number; offsetY: number };

const GRID_SIZE = 20; // 20x20 grid
const KINGS_HIGH_SCORE = 2004;

export default function SnakeGameModal({ isOpen, onClose }: SnakeGameModalProps) {
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>("UP");
  const [score, setScore] = useState<number>(0);
  const [popups, setPopups] = useState<ScorePopup[]>([]);
  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "PAUSED" | "GAMEOVER">("IDLE");

  const directionRef = useRef<Direction>("UP");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Audio Context for eating sound
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playEatSound = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio playback fails silently if blocked or unsupported
    }
  }, []);

  const playGameOverSound = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.25);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio playback fails silently if blocked or unsupported
    }
  }, []);

  // Touch tracking
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Generate random food position avoiding snake
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    while (true) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      const isOnSnake = currentSnake.some((segment) => segment.x === x && segment.y === y);
      if (!isOnSnake) return { x, y };
    }
  }, []);

  // Reset Game
  const resetGame = useCallback((initialDir: Direction = "UP") => {
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection(initialDir);
    directionRef.current = initialDir;
    setScore(0);
    setPopups([]);
    setGameState("PLAYING");
  }, [generateFood]);

  // Handle Direction Change with 180-degree turn prevention
  const changeDirection = useCallback((newDir: Direction) => {
    const currentDir = directionRef.current;
    if (
      (newDir === "UP" && currentDir !== "DOWN") ||
      (newDir === "DOWN" && currentDir !== "UP") ||
      (newDir === "LEFT" && currentDir !== "RIGHT") ||
      (newDir === "RIGHT" && currentDir !== "LEFT")
    ) {
      directionRef.current = newDir;
      setDirection(newDir);
    }
  }, []);

  // Keyboard controls listener (WASD + Arrow keys + Auto-start)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key ? e.key.toLowerCase() : "";
      const code = e.code ? e.code.toLowerCase() : "";

      const isUp = key === "arrowup" || key === "w" || code === "arrowup" || code === "keyw";
      const isDown = key === "arrowdown" || key === "s" || code === "arrowdown" || code === "keys";
      const isLeft = key === "arrowleft" || key === "a" || code === "arrowleft" || code === "keya";
      const isRight = key === "arrowright" || key === "d" || code === "arrowright" || code === "keyd";
      const isActionKey = key === " " || key === "enter" || code === "space" || code === "enter";

      // Prevent scrolling for navigation keys
      if (isUp || isDown || isLeft || isRight || isActionKey) {
        e.preventDefault();
        e.stopPropagation();
      }

      // If game is IDLE or GAMEOVER, pressing any directional key or space/enter starts the game!
      if (gameState === "IDLE" || gameState === "GAMEOVER") {
        if (isUp) resetGame("UP");
        else if (isDown) resetGame("DOWN");
        else if (isLeft) resetGame("LEFT");
        else if (isRight) resetGame("RIGHT");
        else if (isActionKey) resetGame("UP");
        return;
      }

      if (key === "p" || key === "escape" || code === "keyp" || code === "escape") {
        if (gameState === "PLAYING") setGameState("PAUSED");
        else if (gameState === "PAUSED") setGameState("PLAYING");
        return;
      }

      if (gameState !== "PLAYING") return;

      if (isUp) changeDirection("UP");
      else if (isDown) changeDirection("DOWN");
      else if (isLeft) changeDirection("LEFT");
      else if (isRight) changeDirection("RIGHT");
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, gameState, changeDirection, resetGame]);

  // Touch / Swipe controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 25;

    let targetDir: Direction | null = null;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > minSwipeDistance) {
        targetDir = dx > 0 ? "RIGHT" : "LEFT";
      }
    } else {
      if (Math.abs(dy) > minSwipeDistance) {
        targetDir = dy > 0 ? "DOWN" : "UP";
      }
    }

    if (targetDir) {
      if (gameState === "IDLE" || gameState === "GAMEOVER") {
        resetGame(targetDir);
      } else if (gameState === "PLAYING") {
        changeDirection(targetDir);
      }
    }

    touchStartRef.current = null;
  };

  // Main Game Loop Tick with WALL WRAPPING & +10 SCORE INCREMENT
  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        const currentDir = directionRef.current;

        switch (currentDir) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
        }

        // WALL WRAPPING (Snake goes through walls!)
        if (head.x < 0) head.x = GRID_SIZE - 1;
        else if (head.x >= GRID_SIZE) head.x = 0;

        if (head.y < 0) head.y = GRID_SIZE - 1;
        else if (head.y >= GRID_SIZE) head.y = 0;

        // Self collision check
        for (let i = 0; i < prevSnake.length; i++) {
          if (prevSnake[i].x === head.x && prevSnake[i].y === head.y) {
            playGameOverSound();
            setGameState("GAMEOVER");
            return prevSnake;
          }
        }

        const newSnake = [head, ...prevSnake];

        // Food collision check: INCREMENT SCORE BY 10 ONLY
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10);
          playEatSound();

          // Trigger "+10" floating text animation
          setPopups((prev) => [
            ...prev,
            { x: food.x, y: food.y, id: Date.now(), opacity: 1.0, offsetY: 0 },
          ]);

          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // remove tail
        }

        return newSnake;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, food, generateFood, playEatSound, playGameOverSound]);

  // Update floating popups animation
  useEffect(() => {
    if (popups.length === 0) return;

    const timer = setTimeout(() => {
      setPopups((prevPopups) =>
        prevPopups
          .map((p) => ({ ...p, opacity: p.opacity - 0.1, offsetY: p.offsetY - 3 }))
          .filter((p) => p.opacity > 0)
      );
    }, 30);

    return () => clearTimeout(timer);
  }, [popups]);

  // Render game on canvas matching APP THEME
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cellSize = width / GRID_SIZE;

    // Read active app theme CSS properties
    const rootStyle = getComputedStyle(document.body);
    const middleBgColor = rootStyle.getPropertyValue("--middleground").trim() || "#1a1917";
    const borderColor = rootStyle.getPropertyValue("--border").trim() || "rgba(255, 255, 255, 0.1)";

    // Clear canvas with app middleground/background color
    ctx.fillStyle = middleBgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw subtle app-themed grid lines
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(width, i * cellSize);
      ctx.stroke();
    }

    // Draw food (glowing red apple)
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ef4444";
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    const foodRadius = cellSize / 2 - 2;
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      foodRadius,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Draw Snake matching app theme accent/emerald green
    ctx.shadowBlur = 6;
    ctx.shadowColor = "#22c55e";

    snake.forEach((segment, index) => {
      if (index === 0) {
        // Snake Head
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.roundRect(
          segment.x * cellSize + 1,
          segment.y * cellSize + 1,
          cellSize - 2,
          cellSize - 2,
          5
        );
        ctx.fill();

        // Eyes
        ctx.fillStyle = "#000000";
        const eyeOffset = cellSize / 4;
        const eyeSize = 2.2;

        let eye1X = segment.x * cellSize + eyeOffset;
        let eye1Y = segment.y * cellSize + eyeOffset;
        let eye2X = segment.x * cellSize + cellSize - eyeOffset;
        let eye2Y = segment.y * cellSize + eyeOffset;

        if (directionRef.current === "DOWN") {
          eye1Y = segment.y * cellSize + cellSize - eyeOffset;
          eye2Y = segment.y * cellSize + cellSize - eyeOffset;
        } else if (directionRef.current === "LEFT") {
          eye1X = segment.x * cellSize + eyeOffset;
          eye2X = segment.x * cellSize + eyeOffset;
          eye2Y = segment.y * cellSize + cellSize - eyeOffset;
        } else if (directionRef.current === "RIGHT") {
          eye1X = segment.x * cellSize + cellSize - eyeOffset;
          eye2X = segment.x * cellSize + cellSize - eyeOffset;
          eye2Y = segment.y * cellSize + cellSize - eyeOffset;
        }

        ctx.beginPath();
        ctx.arc(eye1X, eye1Y, eyeSize, 0, Math.PI * 2);
        ctx.arc(eye2X, eye2Y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Snake Body
        const opacity = Math.max(0.4, 1 - index * 0.03);
        ctx.fillStyle = `rgba(34, 197, 94, ${opacity})`;
        ctx.beginPath();
        ctx.roundRect(
          segment.x * cellSize + 1.5,
          segment.y * cellSize + 1.5,
          cellSize - 3,
          cellSize - 3,
          4
        );
        ctx.fill();
      }
    });

    // Draw floating "+10" score popups on canvas
    ctx.shadowBlur = 4;
    ctx.shadowColor = "#10b981";
    ctx.font = "bold 13px sans-serif";
    popups.forEach((popup) => {
      ctx.fillStyle = `rgba(16, 185, 129, ${popup.opacity})`;
      const posX = popup.x * cellSize + cellSize / 4;
      const posY = popup.y * cellSize + popup.offsetY;
      ctx.fillText("+10", posX, posY);
    });

    ctx.shadowBlur = 0;
  }, [snake, food, popups]);

  // Helper for direction button click
  const handleDpadClick = (dir: Direction) => {
    if (gameState === "IDLE" || gameState === "GAMEOVER") {
      resetGame(dir);
    } else if (gameState === "PLAYING") {
      changeDirection(dir);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md gap-2">
        <DialogHeader>
          <div className="flex items-center justify-between w-full pr-6">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-emerald-500" />
              <DialogTitle className="text-lg font-bold text-foreground">
                Snake Game
              </DialogTitle>
            </div>
          </div>
          <DialogDescription>
            If you beat me, email and send me a screenshot, once i verify, you can claim your prize!
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between px-1 py-1 text-xs font-mono text-text-muted">
          <span className=" font-bold text-sm">Score: <span className="text-emerald-500">{score}</span></span>
          <span className="text-[12px] bg-middleground px-2 py-0.5 border border-border text-text-muted font-sans">
            <span className="text-emerald-500 font-bold">Tip:</span> You can go through walls!
          </span>
        </div>

        <div
          className="relative flex items-center justify-center bg-middleground border border-border rounded-xl overflow-hidden touch-none select-none my-1 focus:outline-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            className="w-full max-w-[340px] aspect-square block"
          />

          {/* Overlay: Start / Idle Screen */}
          {gameState === "IDLE" && (
            <div className="absolute inset-0 bg-background/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center gap-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 animate-pulse">
                <Gamepad2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">Ready to Play?</h3>
                <p className="text-xs text-text-muted max-w-xs hidden sm:block">
                  Press any <span className="text-emerald-500 font-semibold">Arrow Key</span> or <span className="text-emerald-500 font-semibold">WASD</span> to start!
                </p>
                <p className="text-xs text-text-muted max-w-xs block sm:hidden">
                  Swipe <span className="text-emerald-500 font-semibold">Up, Down, Left, or Right</span> to start!
                </p>
              </div>
              <Button
                onClick={() => resetGame("UP")}
                className="bg-emerald-500 hover:bg-emerald-600 text-foreground font-bold px-6 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-transform active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" /> Start Game
              </Button>
            </div>
          )}

          {/* Overlay: Paused Screen */}
          {gameState === "PAUSED" && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center gap-3">
              <h3 className="text-xl font-bold text-amber-500">Game Paused</h3>
              <p className="text-xs text-text-muted hidden sm:block">Press P or Resume to continue</p>
              <p className="text-xs text-text-muted block sm:hidden">Tap Resume to continue</p>
              <Button
                onClick={() => setGameState("PLAYING")}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-5 py-2 rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" /> Resume
              </Button>
            </div>
          )}

          {/* Overlay: Game Over Screen */}
          {gameState === "GAMEOVER" && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-red-500 tracking-wider">GAME OVER</h3>
                <p className="text-base font-semibold text-foreground">
                  You didn't beat King!
                </p>
              </div>

              {/* Highscore & Final score box */}
              <div className="w-full bg-middleground border border-border rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs text-text-muted border-b border-border pb-2">
                  <span>King's High Score:</span>
                  <span className="text-amber-500 font-bold text-sm flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 inline" /> {KINGS_HIGH_SCORE}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted pt-0.5">
                  <span>Your Final Score:</span>
                  <span className="text-emerald-500 font-bold text-sm">{score}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full pt-1">
                <Button
                  onClick={() => resetGame("UP")}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-foreground font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Play Again
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="bg-middleground hover:bg-foreground hover:text-background dark:hover:bg-foreground"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
}
