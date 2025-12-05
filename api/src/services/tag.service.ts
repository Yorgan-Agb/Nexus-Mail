import { prisma } from "../models/index.ts";
import { NotFoundError } from "../lib/error.ts";

export const allTags = async (userId: number) => {
  const tags = await prisma.tag.findMany({
    where: { userId: userId },
    select: {
      id: true,
      name: true,
      color: true,
    },
  });
  if (tags.length === 0) {
    throw new NotFoundError("Tags not found");
  }
  return tags;
};
