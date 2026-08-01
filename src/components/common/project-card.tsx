import React from 'react'
import NextImage from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  task?: string[];
  image: string;
}

export default function ProjectCard({ title, description, image }: ProjectCardProps) {
  return (
    <div className="flex flex-col gap-2 border border-border">
      <NextImage src={image || ""} alt={title} width={100} height={100} className='h-32 w-auto bg-cover bg-center object-cover object-top border-b border-border' />
      <div className='flex flex-col gap-1 pt-0.5 p-2'>
        <h3 className='text-sm font-medium'>{title}</h3>
        <p className='leading-6 text-sm text-text-muted'>{description}</p>
      </div>
    </div>
  )
}
