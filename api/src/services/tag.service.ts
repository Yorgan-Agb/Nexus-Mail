import { prisma } from "../models/index.ts";
import { NotFoundError, ConflictError } from "../lib/error.ts";
import type { CreateTagsInput } from "../validations/tag.validation.ts";

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

export const addTags = async (userId: number, tagData: CreateTagsInput) => {
  const tagsArray = Array.isArray(tagData) ? tagData : [tagData];
  const isTagExist = await prisma.tag.findFirst({
    where: {
      userId: userId,
      name: { in: tagsArray.map((tag) => tag.name) },
    },
  });
  if (isTagExist) {
    throw new ConflictError(`Tag with name ${isTagExist.name} already exists`);
  }
  const createdTags = await prisma.tag.createMany({
    data: tagsArray.map((tag) => ({
      name: tag.name,
      color: tag.color,
      userId: userId,
    })),
  });

  return createdTags;
};
