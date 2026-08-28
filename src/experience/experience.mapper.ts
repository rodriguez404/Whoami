import type {
  Achievement as AchievementRow,
  Experience as ExperienceRow,
} from '../generated/prisma/client';
import { Achievement } from './entities/achievement.entity';
import { Experience } from './entities/experience.entity';

export function toExperience(row: ExperienceRow): Experience {
  return {
    id: row.id,
    company: row.company,
    position: row.position,
    startDate: row.startDate,
    endDate: row.endDate,
    description: row.summary,
  };
}

export function toAchievement(row: AchievementRow): Achievement {
  return { id: row.id, text: row.text };
}
