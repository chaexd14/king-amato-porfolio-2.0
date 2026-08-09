"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dot } from "lucide-react";

export default function Experiences() {
  const experienceList = [
    {
      title: "Full Stack Software Developer",
      company: "SaikoTeck Solutions",
      year: "Feb 2026 - Present",
      about: [
        "Developed and maintained business applications that automate and streamline business processes, improving operational efficiency for clients.",
        "Led the development and successful deployment of two production projects, coordinating implementation from planning through release.",
        "Built end-to-end features across both the front end and back end using Ruby on Rails and TypeScript, delivering scalable and maintainable solutions.",
        "Designed and integrated RESTful APIs, implemented database-driven functionality, and optimized application performance.",
      ],
    },
    {
      title: "Software Dev. (Internship)",
      company: "IoTera PH",
      year: "Feb 2026 - Apr 2026",
      about: [
        "Configured, tested, and deployed IoT devices to support client and internal system requirements.",
        "Collaborated with the development team to integrate software applications with IoT hardware and connected devices.",
        "Developed and maintained user interface components and RESTful APIs, contributing to the application's functionality and performance.",
      ],
    },
    {
      title: "Web Developer",
      company: "Freelance",
      year: "Jan 2024 - Dec 2025",
      about: [
        "Built responsive, user-friendly interfaces using modern web technologies, ensuring compatibility across desktop and mobile devices.",
        "Collaborated directly with clients to gather requirements, provide technical recommendations, and deliver projects on schedule.",
        "Developed full-stack features, integrated APIs and databases, and implemented functionality tailored to each client's needs.",
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-2 px-6 sm:px-0"
    >
      <h3 className="text-text-muted border-b border-border pb-2 text-sm">
        Experiences
      </h3>
      <Accordion defaultValue={["item-1"]}>
        {experienceList.map((experience) => (
          <AccordionItem key={experience.title} value={experience.title}>
            <AccordionTrigger>
              {/* Desktop */}
              <div className="hidden md:grid md:grid-cols-3 w-full">
                <h3>{experience.company}</h3>
                <h3 className="text-text-muted">{experience.title}</h3>
                <h3 className="text-text-muted text-right pr-2">
                  {experience.year}
                </h3>
              </div>

              {/* Mobile */}
              <div className="flex justify-between w-full md:hidden">
                <div className="flex flex-col">
                  <h3>{experience.company}</h3>
                  <h3 className="text-text-muted">{experience.title}</h3>
                </div>
                <h3 className="text-text-muted text-right pr-2">
                  {experience.year}
                </h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col gap-2">
                {experience.about?.map((about) => (
                  <li key={about}>
                    <span className="text-sm text-text-muted flex justify-start items-start">
                      <Dot />
                      {about}
                    </span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
}
