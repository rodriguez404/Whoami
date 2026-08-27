import type { ProjectKind, SkillCategory, SocialKind } from '../../generated/prisma/enums';

export interface SkillData {
  name: string;
  category: SkillCategory;
}

export interface ExperienceData {
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  summary: string;
  achievements: string[];
  skills: string[];
}

export interface ProjectData {
  slug: string;
  name: string;
  summary: string;
  url: string | null;
  repoUrl: string | null;
  kind: ProjectKind;
  isFeatured: boolean;
  highlights: string[];
  skills: string[];
}

export interface LinkData {
  kind: SocialKind;
  url: string;
  label: string;
}

export interface ProfileData {
  fullName: string;
  headline: string;
  description: string;
  location: string;
  birthDate: string;
  availability: string;
  links: LinkData[];
}
