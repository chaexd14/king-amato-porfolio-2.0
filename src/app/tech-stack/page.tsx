import React from 'react'
import TechStackCard from '@/components/common/tech-stack-card'
import Link from 'next/link'
import { MoveLeft } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

export default function page() {
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
    <section className="flex flex-col gap-10 w-full px-6 sm:px-0">
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
        {techStack.map((item) => (
          <TechStackCard
            key={item.title}
            title={item.title}
            description={item.description}
          />
        ))}

      </div>
    </section>
  )
}
