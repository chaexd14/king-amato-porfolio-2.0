"use client"

import { useState, useEffect } from 'react';
import { CloudMoon, CloudSun } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';

export default function ThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = theme === "light";

  const handleToggle = () => {
    const nextTheme = isLight ? "dark" : "light";
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        setTheme(nextTheme);
      });
    } else {
      setTheme(nextTheme);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      variant="ghost"
      className="text-text-muted relative overflow-hidden"
      aria-label="Toggle Theme"
    >
      {mounted ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ y: -10, opacity: 0, rotate: -30, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
            exit={{ y: 10, opacity: 0, rotate: 30, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {isLight ? <CloudMoon /> : <CloudSun />}
          </motion.div>
        </AnimatePresence>
      ) : (
        <CloudSun />
      )}
    </Button>
  );
}
