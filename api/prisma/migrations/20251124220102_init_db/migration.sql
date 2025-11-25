-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "credit_ai" INTEGER NOT NULL DEFAULT 0,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folders" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mails" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "sendedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderEmail" TEXT NOT NULL,
    "senderName" TEXT,
    "folderId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "filesize" INTEGER NOT NULL,
    "filepath" TEXT NOT NULL,
    "mailId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mail_recipients" (
    "id" SERIAL NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "recipientType" TEXT NOT NULL,
    "mailId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mail_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mails_has_tags" (
    "mailId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mails_has_tags_pkey" PRIMARY KEY ("mailId","tagId")
);

-- CreateTable
CREATE TABLE "ai_usages" (
    "id" SERIAL NOT NULL,
    "feature" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "tokenUsed" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_usages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "folders_userId_idx" ON "folders"("userId");

-- CreateIndex
CREATE INDEX "mails_folderId_idx" ON "mails"("folderId");

-- CreateIndex
CREATE INDEX "mails_userId_idx" ON "mails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "attachments_filepath_key" ON "attachments"("filepath");

-- CreateIndex
CREATE INDEX "attachments_mailId_idx" ON "attachments"("mailId");

-- CreateIndex
CREATE INDEX "mail_recipients_mailId_idx" ON "mail_recipients"("mailId");

-- CreateIndex
CREATE INDEX "tags_userId_idx" ON "tags"("userId");

-- CreateIndex
CREATE INDEX "mails_has_tags_tagId_idx" ON "mails_has_tags"("tagId");

-- CreateIndex
CREATE INDEX "ai_usages_userId_idx" ON "ai_usages"("userId");

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mails" ADD CONSTRAINT "mails_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mails" ADD CONSTRAINT "mails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_mailId_fkey" FOREIGN KEY ("mailId") REFERENCES "mails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mail_recipients" ADD CONSTRAINT "mail_recipients_mailId_fkey" FOREIGN KEY ("mailId") REFERENCES "mails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mails_has_tags" ADD CONSTRAINT "mails_has_tags_mailId_fkey" FOREIGN KEY ("mailId") REFERENCES "mails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mails_has_tags" ADD CONSTRAINT "mails_has_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_usages" ADD CONSTRAINT "ai_usages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
