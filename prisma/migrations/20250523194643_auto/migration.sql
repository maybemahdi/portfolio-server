/*
  Warnings:

  - Added the required column `liveLink` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "liveLink" TEXT NOT NULL;
