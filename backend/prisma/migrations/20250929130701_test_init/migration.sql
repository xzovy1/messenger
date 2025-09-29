/*
  Warnings:

  - You are about to drop the column `user_id` on the `PW` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[password_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `password_id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "public"."PW" DROP CONSTRAINT "PW_user_id_fkey";

-- DropIndex
DROP INDEX "public"."PW_user_id_key";

-- AlterTable
ALTER TABLE "public"."PW" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "password_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_password_id_key" ON "public"."User"("password_id");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_password_id_fkey" FOREIGN KEY ("password_id") REFERENCES "public"."PW"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
