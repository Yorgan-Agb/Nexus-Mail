import { prisma } from "../models/index.ts";
import { NotFoundError } from "../lib/error.ts";

export const allMails = async (userId: number) => {
  const mails = await prisma.mail.findMany({
    where: { userId },
  });

  return mails;
};

export const getMailById = async (userId: number, mailId: number) => {
  const mail = await prisma.mail.findFirst({
    where: { id: mailId, userId },
  });
  if (!mail) {
    throw new NotFoundError("Mail not found");
  }
  return mail;
};
