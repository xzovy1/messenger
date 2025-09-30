/*
  Warnings:

  - You are about to drop the column `password` on the `PW` table. All the data in the column will be lost.
  - Added the required column `hash` to the `PW` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."PW" DROP COLUMN "password",
ADD COLUMN     "hash" TEXT NOT NULL;
