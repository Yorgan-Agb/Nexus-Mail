import { prisma } from "./index.ts";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { config } from "../../config.ts";

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.mailsHasTags.deleteMany();
  await prisma.mailRecipient.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.mail.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.folder.deleteMany();
  await prisma.aiUsage.deleteMany();
  await prisma.user.deleteMany();
  await prisma.refreshToken.deleteMany();

  console.log("🗑️  Database cleaned");

  const user1 = await prisma.user.create({
    data: {
      email: "john.doe@example.com",
      firstname: "John",
      lastname: "Doe",
      password: await argon2.hash("password"),
      birthdate: new Date("1990-05-15"),
      credit_ai: 100,
      role: "user",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane.smith@example.com",
      firstname: "Jane",
      lastname: "Smith",
      password: await argon2.hash("password"),
      birthdate: new Date("1988-09-22"),
      credit_ai: 50,
      role: "admin",
    },
  });

  console.log("✅ Users created");

  const inbox = await prisma.folder.create({
    data: {
      name: "Inbox",
      type: "inbox",
      userId: user1.id,
    },
  });

  const sent = await prisma.folder.create({
    data: {
      name: "Sent",
      type: "sent",
      userId: user1.id,
    },
  });

  const inbox2 = await prisma.folder.create({
    data: {
      name: "Inbox",
      type: "inbox",
      userId: user2.id,
    },
  });

  console.log("✅ Folders created");

  const tagUrgent = await prisma.tag.create({
    data: {
      name: "Urgent",
      color: "#FF0000",
      userId: user1.id,
    },
  });

  const tagWork = await prisma.tag.create({
    data: {
      name: "Work",
      color: "#0000FF",
      userId: user1.id,
    },
  });

  console.log("✅ Tags created");

  const mail1 = await prisma.mail.create({
    data: {
      subject: "Meeting tomorrow",
      body: "Hi John, let's meet tomorrow at 10am to discuss the project.",
      senderEmail: "boss@company.com",
      senderName: "The Boss",
      folderId: inbox.id,
      userId: user1.id,
      readAt: new Date(),
      recipients: {
        create: [
          {
            recipientEmail: "john.doe@example.com",
            recipientType: "to",
          },
        ],
      },
      tags: {
        create: [{ tagId: tagUrgent.id }, { tagId: tagWork.id }],
      },
    },
  });

  const mail2 = await prisma.mail.create({
    data: {
      subject: "Welcome to our newsletter",
      body: "Thank you for subscribing!",
      senderEmail: "newsletter@example.com",
      senderName: "Newsletter Team",
      folderId: inbox.id,
      userId: user1.id,
      attachments: {
        create: [
          {
            filename: "welcome.pdf",
            filesize: 245678,
            filepath: "/uploads/welcome_abc123.pdf",
          },
        ],
      },
      recipients: {
        create: [
          {
            recipientEmail: "john.doe@example.com",
            recipientType: "to",
          },
        ],
      },
    },
  });

  const mail3 = await prisma.mail.create({
    data: {
      subject: "Re: Your inquiry",
      body: "Thanks for your email. I will get back to you soon.",
      senderEmail: "john.doe@example.com",
      senderName: "John Doe",
      folderId: sent.id,
      userId: user1.id,
      readAt: new Date(),
      recipients: {
        create: [
          {
            recipientEmail: "client@example.com",
            recipientType: "to",
          },
        ],
      },
    },
  });

  console.log("✅ Mails created");

  await prisma.aiUsage.create({
    data: {
      feature: "email_summary",
      cost: 5,
      tokenUsed: 150,
      userId: user1.id,
    },
  });

  await prisma.aiUsage.create({
    data: {
      feature: "smart_reply",
      cost: 3,
      tokenUsed: 80,
      userId: user1.id,
    },
  });

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.log("JWT_SECRET is not defined in environment variables");
  }

  const refreshToken1 = jwt.sign(
    { userId: user1.id, userRole: user1.role },
    config.jwtSecret,
    { expiresIn: "24h" }
  );

  const refreshToken2 = jwt.sign(
    { userId: user2.id, userRole: user2.role },
    config.jwtSecret,
    { expiresIn: "24h" }
  );

  await prisma.refreshToken.create({
    data: {
      token: refreshToken1,
      userId: user1.id,
      expire_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      user_agent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      last_used_at: new Date(),
    },
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken2,
      userId: user1.id,
      expire_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      user_agent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      last_used_at: new Date(),
    },
  });

  console.log("✅ AI usages created");

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
