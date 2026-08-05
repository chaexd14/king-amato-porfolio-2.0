import React from 'react'
import Link from 'next/link';

interface TechStackCardProps {
  title?: string;
  description: string[];
  viewMore?: boolean;
}

export default function TechStackCard({ title, description, viewMore }: TechStackCardProps) {
  return (
    <div>
      <h3 className="text-text-muted pb-2 text-sm">{title}</h3>
      <div className='flex flex-wrap gap-3'>
        {description.map((d) => (
          <div key={d} className='border border-border w-fit p-2 py-1 hover:bg-middleground'>
            <span className="leading-6 text-sm text-text-muted">{d}</span>
          </div>
        ))}
        {viewMore && <Link href={"/tech-stack"} className="border border-dashed border-border w-fit p-2 py-1 hover:bg-middleground leading-6 text-sm text-text-muted">View More</Link>}
      </div>
    </div>
  )
}
