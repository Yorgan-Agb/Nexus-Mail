import { prisma } from "../models/index.ts";
import { NotFoundError } from "../lib/error.ts";

export const allMails = async (userId: number) => {
  const mails = await prisma.mail.findMany({
    where: { userId },
  });

  return mails;
};
