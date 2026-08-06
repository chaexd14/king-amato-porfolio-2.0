import Image from "next/image";

// Sections
import AboutMe from "@/sections/about-me";
import Experiences from "@/sections/experiences";
import Projects from "@/sections/projects";
import TechStack from "@/sections/tech-stack";
import GithubContributions from "@/sections/github-contributions";


export default function Home() {
  return (
    <section className="flex flex-col gap-10 w-full">
      <AboutMe />
      <Experiences />
      <Projects />
      <TechStack />
      <GithubContributions />
      <div></div>
    </section>
  );
}
