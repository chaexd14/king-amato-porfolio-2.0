"use client"
import { useState } from "react";
import ProjectCard from '@/components/common/project-card'
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

// Module-level variable to retain expanded count during SPA page transitions
let cachedVisibleCount = 2;

export default function Projects() {
  const [visibleCount, setVisibleCount] = useState(cachedVisibleCount);

  const handleViewMore = () => {
    setVisibleCount((prev) => {
      const nextCount = prev + 10;
      cachedVisibleCount = nextCount;
      return nextCount;
    });
  };

  const project = [
    {
      title: "Spendlyy",
      description: "Helps users track income, manage budgets, and monitor expenses to build better financial habits and make smarter spending decisions",
      task: ["sample1", "sample2", "sample3"],
      image: "/spendlyy_bg.webp",
    },
    {
      title: "Habi",
      description: "Helps users organize schedules, manage tasks, set goals, and build better habits to stay productive and consistent",
      task: ["Schedule Management", "Task Tracking", "Goal Setting"],
      image: "/habi_bg.webp",
    },
    {
      title: "My Schedule",
      description: "Helps users organize schedules, manage events, and plan daily tasks. Designed to make staying organized simple and efficient",
      task: ["sample1", "sample2", "sample3"],
      image: "/myschedule_bg.webp",
    },
    {
      title: "Parkada",
      description: "Simplifies parking operations by managing vehicle entries, exits, and ticketing. Helps improve efficiency and streamline parking management.",
      task: ["sample1", "sample2", "sample3"],
      image: "/parkada_bg.webp",
    },
    {
      title: "MODA",
      description: "Simplifies event booking and management by organizing reservations, schedules, and event details. Helps streamline event planning and operations.",
      task: ["sample1", "sample2", "sample3"],
      image: "/moda_bg.webp",
    },
    {
      title: "Sangunian Kabataan",
      description: "Simplifies nominations, voting, and event management through a centralized platform. Helps streamline SK activities while improving organization and transparency.",
      task: ["sample1", "sample2", "sample3"],
      image: "/sanguniankabataan_bg.webp",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-3 px-6 sm:px-0"
    >
      <h3 className="text-text-muted border-b border-border pb-2 text-sm">
        Projects
      </h3>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
        {project.slice(0, visibleCount).map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </div>
      {visibleCount < project.length && (
        <Button
          onClick={handleViewMore}
          variant="outline"
          className="hover:bg-middleground"
        >
          View More
        </Button>
      )}
    </motion.div>
  )
}
