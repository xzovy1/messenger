/*
  Warnings:

  - A unique constraint covering the columns `[chat_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "chatId" UUID;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "chat_id" UUID;

-- CreateTable
CREATE TABLE "public"."Chat" (
    "id" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_id_key" ON "public"."Chat"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_chat_id_key" ON "public"."User"("chat_id");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
