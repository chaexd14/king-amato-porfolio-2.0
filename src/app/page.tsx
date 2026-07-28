import Image from "next/image";

// Sections
import AboutMe from "@/sections/about-me";
import Experiences from "@/sections/experiences";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg flex flex-col">
      <div className="flex flex-1 justify-center w-full">
        <div className="w-full max-w-3xl flex flex-col pt-2 px-1 sm:px-0">
          <header className="flex items-center justify-between w-full mb-2 px-6 pt-3 sm:px-0">
            <Link
              href="/"
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

          <section className="flex flex-col gap-10 w-full">
            <AboutMe />
            <Experiences />
          </section>
        </div>
      </div>
    </main>
  );
}
