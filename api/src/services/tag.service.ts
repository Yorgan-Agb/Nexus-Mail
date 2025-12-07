import { prisma } from "../models/index.ts";
import { NotFoundError, ConflictError } from "../lib/error.ts";
import type {
  TagsData,
  UpdateTagInput,
  UpdateTagsData,
} from "../validations/tag.validation.ts";

export const allTags = async (userId: number) => {
  const tags = await prisma.tag.findMany({
    where: { userId: userId },
    select: {
      id: true,
      name: true,
      color: true,
    },
  });

  return tags;
};

export const addTags = async (userId: number, tagData: TagsData) => {
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
  await prisma.tag.createMany({
    data: tagsArray.map((tag) => ({
      name: tag.name,
      color: tag.color,
      userId: userId,
    })),
  });
  const createdTags = await prisma.tag.findMany({
    where: {
      userId: userId,
      name: { in: tagsArray.map((tag) => tag.name) },
    },
    select: {
      id: true,
      name: true,
      color: true,
    },
  });
  return createdTags;
};

export const modify = async (
  userId: number,
  tagId: number,
  updateTagData: UpdateTagInput
) => {
  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
  });
  if (!tag || tag.userId !== userId) {
    throw new NotFoundError("Tag not found");
  }
  if (updateTagData.name) {
    const isTagNameTaken = await prisma.tag.findFirst({
      where: {
        userId: userId,
        name: updateTagData.name,
        id: { not: tagId },
      },
    });
    if (isTagNameTaken) {
      throw new ConflictError(
        `Tag with name ${updateTagData.name} already exists`
      );
    }
  }
  const updatedTag = await prisma.tag.update({
    where: { id: tagId },
    data: {
      ...updateTagData,
    },
    select: {
      id: true,
      name: true,
      color: true,
    },
  });
  return updatedTag;
};

export const remove = async (userId: number, tagId: number) => {
  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
  });
  if (!tag || tag.userId !== userId) {
    throw new NotFoundError("Tag not found");
  }
  await prisma.tag.delete({
    where: { id: tagId },
  });
};
