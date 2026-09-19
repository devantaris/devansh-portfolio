import profileData from '@/data/profile.json';
import projectsData from '@/data/projects.json';
import experienceData from '@/data/experience.json';
import publicationsData from '@/data/publications.json';
import skillsData from '@/data/skills.json';

export interface Project {
    id: string;
    name: string;
    tagline: string;
    tech: string[];
    demo: string | null;
    code: string;
    color: string;
    /** Optional screenshot/preview image (path under /public or absolute URL) */
    poster: string | null;
    /** Optional demo video (path under /public or absolute URL) */
    video: string | null;
    impact: string;
    specs: string[];
    featured: boolean;
}

export interface ExperienceItem {
    id: string;
    role: string;
    company: string;
    location: string;
    date: string;
    points: string[];
}

export interface Publication {
    number: string;
    title: string;
    badge: string;
    status: string;
    description: string;
    link: string;
    linkText: string;
}

export interface SkillCategory {
    id: string;
    title: string;
    skills: { name: string; logoUrl: string }[];
}

export const SITE = {
    name: profileData.name,
    title: profileData.title,
    description: profileData.description,
    url: profileData.siteUrl,
    resumePdf: profileData.resumePdf,
} as const;

export const profile = profileData;
export const projects = projectsData as Project[];
export const featuredProjects = projectsData.filter((p) => p.featured) as Project[];
export const experience = experienceData as ExperienceItem[];
export const publications = publicationsData as Publication[];
export const skillCategories = skillsData as SkillCategory[];

/** Prefix asset paths with the GitHub Pages basePath (set via next.config env). */
export const withBasePath = (path: string): string =>
    `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
