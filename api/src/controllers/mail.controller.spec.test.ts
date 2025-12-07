import { describe, it } from "node:test";
import assert from "node:assert";
import {
  buildAuthedRequester,
  fakeUser,
  httpRequest,
} from "../../test/index.ts";
import { prisma } from "../models/index.ts";

describe("[GET] /tags", () => {
  it("should return a 200 status with an empty array when no tags are found for the user", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });
    const requester = buildAuthedRequester(user);
    // ACT
    const response = await requester.get("/tags");

    // ASSERT
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data.tags, []);
  });
  it("should return a 401 status when the user is unauthorized", async () => {
    // ACT
    const response = await httpRequest.get("/tags");

    // ASSERT
    assert.strictEqual(response.status, 401);
  });
});
describe("[GET] /mails/:id", () => {
  it("should return a 200 status with the mail when found", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });
    const folder = await prisma.folder.create({
      data: {
        name: "Inbox",
        type: "inbox",
        userId: user.id,
      },
    });
    const mail = await prisma.mail.create({
      data: {
        subject: "Test Mail",
        body: "This is a test mail.",
        userId: user.id,
        senderEmail: "testmail.chromheart@example.com",
        folderId: folder.id,
      },
    });
    const requester = buildAuthedRequester(user);

    // ACT
    const response = await requester.get(`/mails/${mail.id}`);

    // ASSERT
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data.mail.subject, "Test Mail");
    assert.strictEqual(response.data.mail.body, "This is a test mail.");
  });
  it("should return a 404 status when the mail is not found", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });
    const requester = buildAuthedRequester(user);

    // ACT
    const response = await requester.get(`/mails/1`);

    // ASSERT
    assert.strictEqual(response.status, 404);
  });
  it("should return a 401 status when the user is unauthorized", async () => {
    // ACT
    const response = await httpRequest.get("/mails/1");

    // ASSERT
    assert.strictEqual(response.status, 401);
  });
});
