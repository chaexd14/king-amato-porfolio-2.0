"use client";

import React from 'react'
import TechStackCard from '@/components/common/tech-stack-card'
import Link from 'next/link'
import { MoveLeft } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { motion } from 'motion/react'

export default function Page() {
  const techStack = [
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
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-10 w-full px-6 sm:px-0"
    >
      <div className='flex flex-col gap-2'>
        <header className="flex items-center justify-between w-full pt-3 sm:px-0">
          <h3 className="text-sm font-semibold">
            Tech Stack
          </h3>

          <Link
            href="/"
            scroll={false}
            className={`text-text-muted pl-0 pr-0 ${buttonVariants({ variant: "ghost", size: "sm" })}`}
          >
            <MoveLeft />

            Back Home
          </Link>
        </header>

        <p className='text-text-muted text-sm leading-6'>Here's a glimpse of the technologies I've worked with. Each stack represents a different area of development, from building interactive user interfaces to creating robust backend systems.</p>
      </div>

      <div className='flex flex-col gap-8'>
        {techStack.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <TechStackCard
              title={item.title}
              description={item.description}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
