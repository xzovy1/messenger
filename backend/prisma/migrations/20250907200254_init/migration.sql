-- CreateTable
CREATE TABLE "public"."User" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PW" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "PW_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "bio" VARCHAR(256),
    "dob" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "recipient_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chat_id" UUID
);

-- CreateTable
CREATE TABLE "public"."Chat" (
    "id" UUID NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ChatToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ChatToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "public"."User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "PW_id_key" ON "public"."PW"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PW_user_id_key" ON "public"."PW"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_id_key" ON "public"."Profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_id_key" ON "public"."Profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "public"."Message"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_id_key" ON "public"."Chat"("id");

-- CreateIndex
CREATE INDEX "_ChatToUser_B_index" ON "public"."_ChatToUser"("B");

-- AddForeignKey
ALTER TABLE "public"."PW" ADD CONSTRAINT "PW_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ChatToUser" ADD CONSTRAINT "_ChatToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ChatToUser" ADD CONSTRAINT "_ChatToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
