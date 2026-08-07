"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRestoration({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);

  // Disable default browser scroll restoration so it doesn't conflict
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Save scroll position continuously on scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (pathname) {
        sessionStorage.setItem(`scroll_pos_${pathname}`, window.scrollY.toString());
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // Restore scroll position when pathname changes or on initial mount
  useEffect(() => {
    if (typeof window === "undefined" || !pathname) return;

    // Save position of previous path before context shifts if needed
    if (prevPathname.current && prevPathname.current !== pathname) {
      // position is already saved by continuous scroll listener
    }
    prevPathname.current = pathname;

    const savedPosition = sessionStorage.getItem(`scroll_pos_${pathname}`);
    if (savedPosition !== null) {
      const targetY = parseInt(savedPosition, 10);
      
      // Use requestAnimationFrame / double frame to wait for layout & hydration
      const restoreScroll = () => {
        window.scrollTo({
          top: targetY,
          behavior: "instant" as ScrollBehavior,
        });
      };

      requestAnimationFrame(() => {
        restoreScroll();
        // Secondary trigger in case dynamic images or async components cause layout shifts
        setTimeout(restoreScroll, 50);
        setTimeout(restoreScroll, 150);
      });
    }
  }, [pathname]);

  return <>{children}</>;
}
