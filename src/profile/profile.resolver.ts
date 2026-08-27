import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { ProjectKind, SkillCategory } from '../generated/prisma/enums';
import { Experience } from '../experience/entities/experience.entity';
import { ExperienceService } from '../experience/experience.service';
import { Project } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { Skill } from '../skills/entities/skill.entity';
import { SkillsService } from '../skills/skills.service';
import { Profile } from './entities/profile.entity';
import { SocialLink } from './entities/social-link.entity';
import { ProfileService } from './profile.service';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly skillsService: SkillsService,
    private readonly experienceService: ExperienceService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Query(() => Profile, { description: 'Единственный профиль' })
  profile(): Promise<Profile> {
    return this.profileService.getProfile();
  }

  @ResolveField(() => [SocialLink])
  links(@Parent() profile: Profile): Promise<SocialLink[]> {
    return this.profileService.getLinks(profile.id);
  }

  // Фильтр применяется после выборки: данных на один экран, усложнять запрос
  // ради нескольких строк незачем.
  @ResolveField(() => [Skill])
  async skills(
    @Args('category', { type: () => SkillCategory, nullable: true })
    category?: SkillCategory | null,
  ): Promise<Skill[]> {
    const skills = await this.skillsService.findAll();
    return category ? skills.filter((skill) => skill.category === category) : skills;
  }

  @ResolveField(() => [Experience])
  experience(@Parent() profile: Profile): Promise<Experience[]> {
    return this.experienceService.findByProfileId(profile.id);
  }

  @ResolveField(() => [Project])
  async projects(
    @Parent() profile: Profile,
    @Args('kind', { type: () => ProjectKind, nullable: true }) kind?: ProjectKind | null,
    @Args('featured', { type: () => Boolean, nullable: true }) featured?: boolean | null,
  ): Promise<Project[]> {
    let projects = await this.projectsService.findByProfileId(profile.id);
    if (kind) {
      projects = projects.filter((project) => project.kind === kind);
    }
    // Именно typeof: клиент вправе передать featured: null явно, и это означает
    // "фильтр не нужен", а не "искать проекты с isFeatured === null".
    if (typeof featured === 'boolean') {
      projects = projects.filter((project) => project.isFeatured === featured);
    }
    return projects;
  }
}
