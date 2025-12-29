import { prisma } from "../models/index.ts";
import {
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} from "../lib/error.ts";

export const allUserFolders = async (userId: number) => {
  const folders = await prisma.folder.findMany({
    where: { userId: userId },
    select: {
      id: true,
      name: true,
      type: true,
    },
  });

  return folders;
};

export const uniqueFolder = async (userId: number, type: string) => {
  const folder = await prisma.folder.findUnique({
    where: {
      userId_type: {
        userId: userId,
        type: type,
      },
    },
  });

  if (!folder) {
    throw new NotFoundError("Folder not found");
  }

  return folder;
};
