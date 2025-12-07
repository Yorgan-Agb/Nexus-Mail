import { describe, it } from "node:test";
import assert from "node:assert";
import {
  buildAuthedRequester,
  fakeUser,
  httpRequest,
} from "../../test/index.ts";
import { prisma } from "../models/index.ts";
import { generateAccessToken } from "../lib/auth.ts";

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
