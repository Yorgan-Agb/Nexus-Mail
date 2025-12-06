import { describe, it } from "node:test";
import assert from "node:assert";
import { httpRequest } from "../../test/index.ts";
import { prisma } from "../models/index.ts";
import { fakeUser, authedRequester } from "../../test/index.ts";
import { generateAccessToken } from "../lib/auth.ts";

describe("[GET] /tags", () => {
  it("should return a list of tags for the authenticated user", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });
    const tagData = [
      { name: "Work", color: "blue", userId: user.id },
      { name: "Personal", color: "green", userId: user.id },
    ];
    await prisma.tag.createMany({
      data: tagData,
    });
    const accessToken = generateAccessToken(user);

    // ACT
    const response = await httpRequest.get("/tags", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // ASSERT
    assert.strictEqual(response.status, 200);
    const tags = response.data.tags;
    assert.strictEqual(tags.length, 2);
    assert.deepStrictEqual(
      tags.map((tag: any) => ({ name: tag.name, color: tag.color })),
      tagData.map(({ name, color }) => ({ name, color }))
    );
  });
  it("should return a 404 status when no tags are found for the user", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });
    const accessToken = generateAccessToken(user);

    // ACT
    const response = await httpRequest.get("/tags", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // ASSERT
    assert.strictEqual(response.status, 404);
  });
  it("should return a 401 status when the user is unauthorized", async () => {
    // ACT
    const response = await httpRequest.get("/tags");

    // ASSERT
    assert.strictEqual(response.status, 401);
  });
});

describe("[POST] /tags", () => {
  it("should create new tags for the authenticated user", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });
    const accessToken = generateAccessToken(user);
    const newTags = {
      tags: [
        { name: "Important", color: "#FF0000" },
        { name: "Work", color: "#0000FF" },
      ],
    };
    await prisma.tag.createMany({
      data: newTags.tags.map((tag) => ({
        name: tag.name,
        color: tag.color,
        userId: user.id,
      })),
    });

    // ACT
    const response = await httpRequest.post("/tags", newTags, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // ASSERT
    assert.strictEqual(response.status, 201);
    const createdTags = response.data.tags;
    assert.strictEqual(createdTags.length, 2);
    assert.deepStrictEqual(
      createdTags.map((tag: any) => ({ name: tag.name, color: tag.color })),
      newTags.tags
    );
  });
});
