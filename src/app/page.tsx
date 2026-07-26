import Image from "next/image";
import AboutMe from "@/sections/about-me";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg flex flex-col">
      <div className="flex flex-1 justify-center w-full">
        <div className="w-full max-w-4xl flex flex-col pt-2 px-1 sm:px-0">
          <header className="flex items-center justify-between w-full mb-2">
            <Link
              href="/"
              className={` ${buttonVariants({ variant: "ghost"})}`}
            >
              {"<Chae />"}
            </Link>

            <a
              href="https://kingamato.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-text-muted ${buttonVariants({ variant: "ghost", size: "sm" })}`}
            >
              My Old Portfolio
              <MoveUpRight />
            </a>
          </header>

          <section>
            <AboutMe />
          </section>
        </div>
      </div>
    </main>
  );
}
