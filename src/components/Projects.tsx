"use client";

import ProjectCard from './ProjectCard';

const projects = [
  {
    title: 'Project 1',
    description: 'A brief description of your first project. Explain what it does and what technologies you used.',
    imageUrl: '/project1.jpg',
    technologies: ['React', 'Node.js', 'MongoDB'],
    liveUrl: 'https://project1.com',
    githubUrl: 'https://github.com/yourusername/project1',
  },
  {
    title: 'Project 2',
    description: 'Description of your second project. Highlight the key features and your role in development.',
    imageUrl: '/project2.jpg',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://project2.com',
    githubUrl: 'https://github.com/yourusername/project2',
  },
  {
    title: 'Project 3',
    description: 'Details about your third project. Focus on the problem it solves and your technical approach.',
    imageUrl: '/project3.jpg',
    technologies: ['Python', 'Django', 'PostgreSQL'],
    liveUrl: 'https://project3.com',
    githubUrl: 'https://github.com/yourusername/project3',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="w-full py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
} 