"use client";

import React from "react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import Shuffle from "@/components/Shuffle";
import { MoveUpRight } from "lucide-react";
import { Heart } from "lucide-react";

import EmailForm from "@/components/email/email-form";

export default function AboutMe() {
  const [isHeartClicked, setIsHeartClicked] = React.useState(false);
  const [isGif, setIsGif] = React.useState(false);
  const [gifKey, setGifKey] = React.useState(0);

  const handleHeartClick = () => {
    setIsHeartClicked(true);
  };

  React.useEffect(() => {
    const preloadGif = new window.Image();
    preloadGif.src = "/king-amato-gif.gif";
  }, []);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleGifClick = () => {
    setIsGif(true);
    setGifKey((prev) => prev + 1);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsGif(false);
    }, 1200);
  };

  const handleActionClick = () => {
    handleHeartClick();
    handleGifClick();
  };

  return (
    <div className="w-full px-6 sm:px-0">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-[18px]">
        {isGif ? (
          <img
            key={gifKey}
            src="/king-amato-gif.gif"
            alt="King Amato"
            height={180}
            width={180}
            className="border border-red-500 shadow-xl shadow-red-500/50"
          />
        ) : (
          <NextImage
            src="/king-amato.jpg"
            alt="King Amato"
            height={180}
            width={180}
          />
        )}

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <Shuffle
              text="Hi I'm King Amato!"
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.03}
              threshold={0.1}
              triggerOnce={false}
              triggerOnHover
              respectReducedMotion={true}
              // required props
              onShuffleComplete={() => { }}
              colorFrom="#111827"
              colorTo="#0c0a09"
              textAlign="left"
              loop
              loopDelay={5}
            />
            <p className="leading-6 text-sm text-text-muted">
              I'm a 4th-year IT student at Rizal Technological University who
              enjoys coding and problem-solving as I work toward becoming a
              successful software engineer.
            </p>
            <p className="leading-6 text-sm text-text-muted">
              When I’m not working on tech projects, you’ll find me Gaming,
              Drawing, Crafting or Riding my Motorcycle as I blend creativity
              with code to make a difference.
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <Button onClick={handleActionClick}>
              Hi! <Heart fill={isHeartClicked ? "currentColor" : "none"} />
            </Button>
            <a href="/KING-AMATO-CV.pdf" download>
              <Button variant="outline" className="bg-middleground">
                Read my CV
                <MoveUpRight />
              </Button>
            </a>
            <EmailForm />
          </div>
        </div>
      </div>
    </div>
  );
}
