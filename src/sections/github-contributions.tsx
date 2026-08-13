"use client";

import React, { useState, useEffect } from "react";
import { ActivityCalendar, Activity } from "react-activity-calendar";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";

interface GithubContributionsProps {
  username?: string;
}

// Module-level cache to persist data during client-side navigation
const cache: Record<string, Activity[]> = {};

export default function GithubContributions({
  username = "chaexd14",
}: GithubContributionsProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const cacheKey = `github_contributions_${username}`;

  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Check cache after component mounts on client to avoid hydration mismatch
    let cachedData: Activity[] | null = cache[username] || null;
    if (!cachedData && typeof window !== "undefined") {
      const saved = sessionStorage.getItem(cacheKey);
      if (saved) {
        try {
          cachedData = JSON.parse(saved);
          if (cachedData) cache[username] = cachedData;
        } catch (e) { }
      }
    }

    if (cachedData && cachedData.length > 0) {
      setData(cachedData);
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError(false);

    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch contribution data");
        return res.json();
      })
      .then((json) => {
        if (isMounted && json.contributions) {
          cache[username] = json.contributions;
          if (typeof window !== "undefined") {
            sessionStorage.setItem(cacheKey, JSON.stringify(json.contributions));
          }
          setData(json.contributions);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted && (!cachedData || cachedData.length === 0)) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [username]);

  // Custom theme derived dynamically from the CSS design system (--primary)
  const portfolioTheme = {
    light: [
      "transparent",
      "color-mix(in srgb, var(--primary) 20%, transparent)",
      "color-mix(in srgb, var(--primary) 45%, transparent)",
      "color-mix(in srgb, var(--primary) 70%, transparent)",
      "var(--primary)",
    ],
    dark: [
      "transparent",
      "color-mix(in srgb, var(--primary) 20%, transparent)",
      "color-mix(in srgb, var(--primary) 45%, transparent)",
      "color-mix(in srgb, var(--primary) 70%, transparent)",
      "var(--primary)",
    ],
  };

  const colorScheme = mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-3 px-6 sm:px-0 w-full"
    >
      <header className="flex items-center border-b border-border pb-2 justify-between w-full pt-3 sm:px-0">
        <h3 className="text-text-muted text-sm">
          GitHub Contributions
        </h3>

        <Link
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-text-muted pl-0 pr-0 ${buttonVariants({
            variant: "ghost",
            size: "sm",
          })}`}
        >
          @{username}
          <MoveUpRight className="w-4 h-4 ml-1" />
        </Link>
      </header>

      <div className="text-text-muted w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex justify-start items-center [&_.react-activity-calendar]:w-full [&_svg]:w-full [&_svg]:h-auto">
        {loading ? (
          <div className="w-full h-28 animate-pulse bg-border/20 rounded flex items-center justify-center text-xs text-text-muted">
            Loading activity data...
          </div>
        ) : error ? (
          <div className="text-xs text-text-muted py-4">
            Could not load GitHub activity data.
          </div>
        ) : (
          <ActivityCalendar
            data={data}
            theme={portfolioTheme}
            colorScheme={colorScheme}
            blockSize={12}
            blockMargin={3}
            blockRadius={0}
            fontSize={12}
            showColorLegend={false}
            showMonthLabels={true}
            showTotalCount={true}
            labels={{
              totalCount: "{{count}} contributions in the last year",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
