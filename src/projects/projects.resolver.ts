import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Skill } from '../skills/entities/skill.entity';
import { SkillsLoaders } from '../skills/skills.loaders';
import { Project } from './entities/project.entity';
import { ProjectHighlight } from './entities/project-highlight.entity';
import { ProjectsLoaders } from './projects.loaders';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(
    private readonly loaders: ProjectsLoaders,
    private readonly skillsLoaders: SkillsLoaders,
  ) {}

  @ResolveField(() => [ProjectHighlight])
  highlights(@Parent() project: Project): Promise<ProjectHighlight[]> {
    return this.loaders.highlightsByProjectId.load(project.id);
  }

  @ResolveField(() => [Skill])
  skills(@Parent() project: Project): Promise<Skill[]> {
    return this.skillsLoaders.byProjectId.load(project.id);
  }
}
