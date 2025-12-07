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
  it("should return a 200 status with an empty array when no tags are found for the user", async () => {
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
    assert.strictEqual(response.status, 200);
  });
  it("should return a 401 status when the user is unauthorized", async () => {
    // ACT
    const response = await httpRequest.get("/tags");

    // ASSERT
    assert.strictEqual(response.status, 401);
  });
});

describe("[POST] /tags/new", () => {
  it("should create new tags for the authenticated user", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });
    const accessToken = generateAccessToken(user);
    const newTags = {
      tags: [
        { name: "Test", color: "#FF0001" },
        { name: "Shop", color: "#C2D3D3" },
      ],
    };

    // ACT
    const response = await httpRequest.post("/tags/new", newTags, {
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
  it("should return a 409 status when trying to create a tag that already exists", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });
    const existingTag = await prisma.tag.create({
      data: { name: "ExistingTag", color: "#123456", userId: user.id },
    });
    const accessToken = generateAccessToken(user);
    const newTags = {
      tags: [{ name: existingTag.name, color: "#654321" }],
    };

    // ACT
    const response = await httpRequest.post("/tags/new", newTags, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // ASSERT
    assert.strictEqual(response.status, 409);
  });
});

describe("[PATCH] /tags/update/:id", () => {
  it("should update an existing tag for the authenticated user", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });
    const tag = await prisma.tag.create({
      data: { name: "OldName", color: "#000000", userId: user.id },
    });
    const accessToken = generateAccessToken(user);
    const updatedTagData = {
      name: "NewName",
      color: "#FFFFFF",
    };

    // ACT
    const response = await httpRequest.patch(
      `/tags/update/${tag.id}`,
      updatedTagData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // ASSERT
    assert.strictEqual(response.status, 200);
    const updatedTag = response.data.tag;
    assert.strictEqual(updatedTag.name, updatedTagData.name);
    assert.strictEqual(updatedTag.color, updatedTagData.color);
  });
  it("should return a 404 status when trying to update a non-existent tag", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });
    const accessToken = generateAccessToken(user);
    const updatedTagData = {
      name: "NonExistent",
      color: "#FFFFFF",
    };

    // ACT
    const response = await httpRequest.patch(
      `/tags/update/9999`,
      updatedTagData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // ASSERT
    assert.strictEqual(response.status, 404);
  });
  it("should return a 409 status when trying to update a tag to a name that already exists", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });
    const tag1 = await prisma.tag.create({
      data: { name: "TagOne", color: "#111111", userId: user.id },
    });
    const tag2 = await prisma.tag.create({
      data: { name: "TagTwo", color: "#222222", userId: user.id },
    });
    const accessToken = generateAccessToken(user);
    const updatedTagData = {
      name: tag1.name,
      color: "#333333",
    };

    // ACT
    const response = await httpRequest.patch(
      `/tags/update/${tag2.id}`,
      updatedTagData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // ASSERT
    assert.strictEqual(response.status, 409);
  });
});

describe("[DELETE] /tags/remove/:id", () => {
  it("should delete an existing tag for the authenticated user", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });
    const tag = await prisma.tag.create({
      data: { name: "ToBeDeleted", color: "#000000", userId: user.id },
    });
    const accessToken = generateAccessToken(user);

    // ACT
    const response = await httpRequest.delete(`/tags/remove/${tag.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // ASSERT
    assert.strictEqual(response.status, 200);
    const deletedTag = await prisma.tag.findUnique({
      where: { id: tag.id },
    });
    assert.strictEqual(deletedTag, null);
  });
  it("should return a 404 status when trying to delete a non-existent tag", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });
    const accessToken = generateAccessToken(user);

    // ACT
    const response = await httpRequest.delete(`/tags/remove/9999`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // ASSERT
    assert.strictEqual(response.status, 404);
  });
});
