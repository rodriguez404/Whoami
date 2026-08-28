import type {
  Project as ProjectRow,
  ProjectHighlight as ProjectHighlightRow,
} from '../generated/prisma/client';
import { Project } from './entities/project.entity';
import { ProjectHighlight } from './entities/project-highlight.entity';

export function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.summary,
    url: row.url,
    repoUrl: row.repoUrl,
    kind: row.kind,
    isFeatured: row.isFeatured,
  };
}

export function toProjectHighlight(row: ProjectHighlightRow): ProjectHighlight {
  return { id: row.id, text: row.text };
}
