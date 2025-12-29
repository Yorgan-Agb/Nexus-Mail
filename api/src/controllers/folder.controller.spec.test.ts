import { describe, it } from "node:test";
import assert from "node:assert";
import { buildAuthedRequester, httpRequest } from "../../test/index.ts";
import { prisma } from "../models/index.ts";
import { fakeUser, authedRequester } from "../../test/index.ts";
import { generateAccessToken } from "../lib/auth.ts";

describe("[GET] /folders", () => {
  it("should return a 200 status with a list of folders for the authenticated user", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });
    const folderData = [
      { name: "Inbox", type: "system", userId: user.id },
      { name: "Work", type: "custom", userId: user.id },
    ];
    await prisma.folder.createMany({
      data: folderData,
    });
    const accessToken = generateAccessToken(user);

    // ACT
    const response = await httpRequest.get("/folders", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // ASSERT
    assert.strictEqual(response.status, 200);
    const folders = response.data.folders;
    assert.strictEqual(folders.length, 2);
    assert.deepStrictEqual(
      folders.map((folder: any) => ({ name: folder.name, type: folder.type })),
      folderData.map(({ name, type }) => ({ name, type }))
    );
  });
  it("should return a 401 status when the user is unauthorized", async () => {
    // ACT
    const response = await httpRequest.get("/folders");

    // ASSERT
    assert.strictEqual(response.status, 401);
  });
});
describe("[GET] /folders/:type", () => {
  it("should return a 200 status with the folder", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });
    const folder = await prisma.folder.create({
      data: { name: "Inbox", type: "inbox", userId: user.id },
    });
    const requester = buildAuthedRequester(user);
    // ACT
    const response = await requester.get(`/folders/${folder.type}`);
    // ASSERT
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data.folder.name, "Inbox");
    assert.strictEqual(response.data.folder.userId, user.id);
  });
  it("should return a 404 status if the folder doesn't exist", async () => {
    //ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });
    const requester = buildAuthedRequester(user);

    //ACT
    const response = await requester.get(`/folders/trash`);

    //ASSERT
    assert.strictEqual(response.status, 404);
  });
});
