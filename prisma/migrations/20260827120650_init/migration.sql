-- CreateEnum
CREATE TYPE "SocialKind" AS ENUM ('GITHUB', 'TELEGRAM', 'EMAIL', 'WEBSITE');

-- CreateEnum
CREATE TYPE "SkillCategory" AS ENUM ('LANGUAGE', 'DATABASE', 'INFRA', 'FRONTEND', 'TOOLING');

-- CreateEnum
CREATE TYPE "ProjectKind" AS ENUM ('PRODUCT', 'INFRASTRUCTURE', 'GAMEDEV');

-- CreateTable
CREATE TABLE "profile" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "full_name" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "birth_date" DATE NOT NULL,
    "availability" TEXT NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_link" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "kind" "SocialKind" NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "social_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "SkillCategory" NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "summary" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievement" (
    "id" SERIAL NOT NULL,
    "experience_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "url" TEXT,
    "repo_url" TEXT,
    "kind" "ProjectKind" NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_highlight" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "project_highlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience_skill" (
    "experience_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,

    CONSTRAINT "experience_skill_pkey" PRIMARY KEY ("experience_id","skill_id")
);

-- CreateTable
CREATE TABLE "project_skill" (
    "project_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,

    CONSTRAINT "project_skill_pkey" PRIMARY KEY ("project_id","skill_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "social_link_profile_id_kind_key" ON "social_link"("profile_id", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "skill_name_key" ON "skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "experience_company_start_date_key" ON "experience"("company", "start_date");

-- CreateIndex
CREATE UNIQUE INDEX "achievement_experience_id_sort_order_key" ON "achievement"("experience_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "project_slug_key" ON "project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "project_highlight_project_id_sort_order_key" ON "project_highlight"("project_id", "sort_order");

-- AddForeignKey
ALTER TABLE "social_link" ADD CONSTRAINT "social_link_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience" ADD CONSTRAINT "experience_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_highlight" ADD CONSTRAINT "project_highlight_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_skill" ADD CONSTRAINT "experience_skill_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_skill" ADD CONSTRAINT "experience_skill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_skill" ADD CONSTRAINT "project_skill_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_skill" ADD CONSTRAINT "project_skill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Профиль ровно один: инвариант закреплён в БД, а не только в логике сида.
ALTER TABLE "profile" ADD CONSTRAINT "profile_singleton" CHECK ("id" = 1);
