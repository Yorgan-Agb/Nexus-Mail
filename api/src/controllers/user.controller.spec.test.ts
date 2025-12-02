import { describe, it } from "node:test";
import assert from "node:assert";
import { httpRequest } from "../../test/index.ts";
import { prisma } from "../models/index.ts";
import argon2 from "argon2";
import { authedRequester, adminRequester, fakeUser } from "../../test/index.ts";
import { generateAccessToken } from "../lib/auth.ts";

describe("[GET] /users", () => {
  it("should return a list of users when requested by admin", async () => {
    // ARRANGE
    const user = await prisma.user.createMany({
      data: [
        {
          firstname: "Test1",
          lastname: "User1",
          email: "test1.user1@example.com",
          password: await argon2.hash("password1"),
          birthdate: new Date("1991-01-01"),
          credit_ai: 50,
          role: "user",
        },
        {
          firstname: "Test2",
          lastname: "User2",
          email: "test2.user2@example.com",
          password: await argon2.hash("password2"),
          birthdate: new Date("1992-02-02"),
          credit_ai: 60,
          role: "user",
        },
      ],
    });

    // ACT
    const { data: body } = await adminRequester.get("/users");

    // ASSERT
    assert.equal(body.users.length, 2);
    assert.equal(body.users[0].email, "test1.user1@example.com");
    assert.equal(body.users[1].email, "test2.user2@example.com");
  });
});
describe("[GET] /users/me", () => {
  it("should return a 200 status with user profile ", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });

    const accessToken = generateAccessToken(user);

    // ACT
    const { data, status } = await httpRequest.get("/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // ASSERT
    assert.strictEqual(status, 200);
    assert.strictEqual(data.user.email, fakeUser.email);
    assert.strictEqual(data.user.firstname, fakeUser.firstname);
    assert.strictEqual(data.user.lastname, fakeUser.lastname);
  });
  it("should return a 401 status when access token is missing", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: fakeUser,
    });

    // ACT
    const profileResponse = await httpRequest.get("/users/me");

    // ASSERT
    assert.strictEqual(profileResponse.status, 401);
  });
});
