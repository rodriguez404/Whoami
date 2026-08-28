-- AlterTable
ALTER TABLE "skill" ADD COLUMN     "is_core" BOOLEAN NOT NULL DEFAULT true;

-- Обяз. по ТЗ
ALTER TABLE "project" ADD CONSTRAINT "project_has_link"
  CHECK ("url" IS NOT NULL OR "repo_url" IS NOT NULL);
