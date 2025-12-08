import { prisma } from "../models/index.ts";
import { NotFoundError, ConflictError } from "../lib/error.ts";

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

export const getById = async (id: number) => {};
