"use client"

import { useState, useEffect } from 'react';
import { CloudMoon, CloudSun } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';


export default function ThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      variant="ghost"
      className="text-text-muted"
    >
      {mounted && theme === "light" ? <CloudMoon /> : <CloudSun />}
    </Button>
  )
}
