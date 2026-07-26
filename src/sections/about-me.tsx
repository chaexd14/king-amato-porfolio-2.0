"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Shuffle from "@/components/Shuffle";
import { MoveUpRight } from 'lucide-react';
import { Heart } from 'lucide-react';

export default function AboutMe() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full border-t border-border px-4 pt-3 sm:px-0 sm:pt-3">
      <Image src="/king-amato.jpg" alt="King Amato" width={180} height={180} />
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
            onShuffleComplete={() => {}}
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
            When I’m not working on tech projects,
            you’ll find me Gaming, Drawing, Crafting or Riding my Motorcycle as
            I blend creativity with code to make a difference.
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <Button>Hi! <Heart /></Button>
          <Button variant="outline" className="bg-middleground">
            Read my CV
            <MoveUpRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
