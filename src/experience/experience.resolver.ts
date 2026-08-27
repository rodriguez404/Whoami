import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Skill } from '../skills/entities/skill.entity';
import { SkillsLoaders } from '../skills/skills.loaders';
import { Achievement } from './entities/achievement.entity';
import { Experience } from './entities/experience.entity';
import { ExperienceLoaders } from './experience.loaders';

@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(
    private readonly loaders: ExperienceLoaders,
    private readonly skillsLoaders: SkillsLoaders,
  ) {}

  // Поля-резолверы, а не include в корневом запросе: не запросил клиент
  // достижения — в базу за ними никто не пойдёт.
  @ResolveField(() => [Achievement])
  achievements(@Parent() experience: Experience): Promise<Achievement[]> {
    return this.loaders.achievementsByExperienceId.load(experience.id);
  }

  @ResolveField(() => [Skill])
  skills(@Parent() experience: Experience): Promise<Skill[]> {
    return this.skillsLoaders.byExperienceId.load(experience.id);
  }
}
