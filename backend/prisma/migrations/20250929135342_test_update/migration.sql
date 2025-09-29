-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_password_id_fkey";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "password_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_password_id_fkey" FOREIGN KEY ("password_id") REFERENCES "public"."PW"("id") ON DELETE SET NULL ON UPDATE CASCADE;
