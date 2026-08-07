import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { GeistPixelSquare, GeistPixelGrid, GeistPixelCircle, GeistPixelTriangle, GeistPixelLine } from 'geist/font/pixel';

import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";

import ScrollRestoration from "@/components/providers/scroll-restoration";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "King Amato - Software Developer & Web Developer",
  description: "Personal website of King Amato, a software developer and web developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", GeistSans.className, GeistMono.className, GeistPixelSquare.variable, "font-sans", geist.variable)}
    >

      <body className="min-h-screen flex justify-center w-full">
        <ScrollRestoration>
          <div className="w-full max-w-3xl min-h-screen flex flex-col pt-2 px-1 sm:px-0">
            <header className="flex items-center justify-between w-full mb-2 px-6 pt-3 border-b border-border sm:px-0">
              <Link
                href="/"
                scroll={false}
                className={`pl-0 pr-0 ${buttonVariants({ variant: "ghost" })}`}
              >
                {"<Chae />"}
              </Link>

              <a
                href="https://kingamato.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-text-muted pl-0 pr-0 ${buttonVariants({ variant: "ghost", size: "sm" })}`}
              >
                My Old Portfolio
                <MoveUpRight />
              </a>
            </header>
            <main className="flex-1 w-full">{children}</main>
            <footer className="flex items-center justify-center w-full mb-2 px-6 pt-3 border-t border-border sm:px-0 mt-auto">
              <p className="text-sm leading-6 text-text-muted">
                © 2026 King Amato. All rights reserved.
              </p>
            </footer>
          </div>
        </ScrollRestoration>
      </body>
    </html>
  );
}
