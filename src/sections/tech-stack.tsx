"use client";

import React from 'react'
import TechStackCard from '@/components/common/tech-stack-card'
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { MoveUpRight } from "lucide-react";
import { motion } from "motion/react";

export default function TechStack() {

  const techStack = [
    {
      title: "Preview",
      description: ["JavaScript", "TypeScript", "React", "Next.Js", "Python", "Ruby on Rails", "PostgressSQL", "MongoDB", "Claude Code", "Git", "GitHub",]
    },

    {
      title: "Frontend",
      description: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.Js", "Vite", "Tailwind Css", "BootStrap", "Webpack", "Prettier", "ESLint", "Styled-Components"],
    },

    {
      title: "Backend",
      description: ["Node.js", "Express.js", "Java", "Python", "PHP", "C++", "Ruby on Rails", "PostgressSQL", "MySQL", "MongoDB", "JWT", "Better Auth", "Rest"]
    },

    {
      title: "AI",
      description: ["Claude Code", "Gemini", "GPT", "Codex"]
    },

    {
      title: "Developer Tools",
      description: ["Git", "GitHub", "GitLab", "Postman", "Figma", "VS Code", "Antigravity", "PyCharm", "IntelliJ", "Discord"]
    }
  ]

  const preview = techStack.find((tech) => tech.title === "Preview");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-3 px-6 sm:px-0"
    >
      <header className="flex items-center border-b border-border pb-2 justify-between w-full pt-3 sm:px-0">
        <h3 className="text-text-muted text-sm">
          Tech Stack
        </h3>

        <Link
          href="/tech-stack"
          className={`text-text-muted pl-0 pr-0 ${buttonVariants({ variant: "ghost", size: "sm" })}`}
        >
          View All
          <MoveUpRight />
        </Link>
      </header>

      <div className='flex'>
        {preview && (
          <TechStackCard
            key={preview.title}
            description={preview.description}
            viewMore={true}
          />
        )}
      </div>
    </motion.div>
  )
}
