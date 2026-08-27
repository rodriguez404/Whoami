import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Skill } from '../skills/entities/skill.entity';
import { Project } from './entities/project.entity';
import { ProjectsLoaders } from './projects.loaders';

// Обратная связь навык -> проекты живёт здесь, а не в модуле навыков:
// иначе модули ссылались бы друг на друга по кругу.
@Resolver(() => Skill)
export class SkillProjectsResolver {
  constructor(private readonly loaders: ProjectsLoaders) {}

  @ResolveField(() => [Project])
  projects(@Parent() skill: Skill): Promise<Project[]> {
    return this.loaders.projectsBySkillId.load(skill.id);
  }
}
