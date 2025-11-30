import { describe, it } from "node:test";
import assert from "node:assert";
import { httpRequest } from "../../test/index.ts";
import { prisma } from "../models/index.ts";
import argon2 from "argon2";
import { generateRefreshToken } from "../lib/auth.ts";

describe("[POST] /auth/register", () => {
  it("should return a 201 status when user is registered successfully", async () => {
    // ARRANGE
    const fakeId = 34;
    const body = {
      id: fakeId,
      firstname: "Jane",
      lastname: "Doe",
      email: "jane.doe@example.com",
      password: "securePassword123!",
      birthdate: "1990-01-01",
    };
    // ACT
    await httpRequest.post("/auth/register", body);

    // ASSERT
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });
    assert.ok(user!.id);
    assert.strictEqual(user!.firstname, body.firstname);
    assert.strictEqual(user!.lastname, body.lastname);
    assert.strictEqual(user!.email, body.email);
    assert.strictEqual(
      user!.birthdate.toISOString(),
      new Date(body.birthdate).toISOString()
    );
  });
  it("should return a 409 status when trying to register an existing user", async () => {
    // ARRANGE
    const body = {
      firstname: "John",
      lastname: "Smith",
      email: "john.smith@example.com",
      password: "anotherSecurePassword456!",
      birthdate: "1985-05-15",
    };
    await httpRequest.post("/auth/register", body);
    // ACT
    const response = await httpRequest.post("/auth/register", body);

    // ASSERT
    assert.strictEqual(response.status, 409);
  });
});

describe("[POST] /auth/login", () => {
  it("should return a 200 status and token when login is succcessful", async () => {
    // ARRANGE

    const user = await prisma.user.create({
      data: {
        firstname: "Alice",
        lastname: "Johnson",
        email: "alice.johnson@example.com",
        password: await argon2.hash("password123"),
        birthdate: new Date("1992-07-20"),
      },
    });
    const body = {
      email: "alice.johnson@example.com",
      password: "password123",
    };

    // ACT
    const data = await httpRequest.post("/auth/login", body);

    // ASSERT
    assert.strictEqual(data.status, 200);
  });
  it("should return two tokens on successful login", async () => {
    // ARRANGE

    const user = await prisma.user.create({
      data: {
        firstname: "Bob",
        lastname: "Williams",
        email: "bob.williams@example.com",
        password: await argon2.hash("mySecretPwd!"),
        birthdate: new Date("1988-11-30"),
      },
    });
    const body = {
      email: "bob.williams@example.com",
      password: "mySecretPwd!",
    };

    // ACT
    const data = await httpRequest.post("/auth/login", body);

    // ASSERT
    assert.strictEqual(data.status, 200);
    assert.ok(data.data.accessToken);
    assert.ok(data.data.refreshToken);
  });
  it("sould return a 401 status when login fails due to incorrect mail or password", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: {
        firstname: "Bob",
        lastname: "Williams",
        email: "bob.williams@example.com",
        password: await argon2.hash("mySecretPwd!"),
        birthdate: new Date("1988-11-30"),
      },
    });
    const body = {
      email: "bob.williams@example.com",
      password: "incorrectPassword",
    };

    // ACT
    const data = await httpRequest.post("/auth/login", body);

    // ASSERT
    assert.strictEqual(data.status, 401);
  });
  it("should return a 404 status when login fails due to non-existing user", async () => {
    // ARRANGE
    const body = {
      email: "non.existing.user@example.com",
      password: "somePassword",
    };

    // ACT
    const data = await httpRequest.post("/auth/login", body);

    // ASSERT
    assert.strictEqual(data.status, 404);
  });
});

describe("[POST] /auth/refresh", () => {
  it("should return a new access token with 200 status when refresh token is valid", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: {
        firstname: "Bob",
        lastname: "Williams",
        email: "bob.williams@example.com",
        password: await argon2.hash("mySecretPwd!"),
        birthdate: new Date("1988-11-30"),
      },
    });
    const login = {
      email: "bob.williams@example.com",
      password: "mySecretPwd!",
    };
    const loginResponse = await httpRequest.post("/auth/login", login);
    const refreshToken = loginResponse.data.refreshToken;

    const refreshBody = {
      refreshToken: refreshToken,
    };

    // ACT
    const refreshResponse = await httpRequest.post(
      "/auth/refresh",
      refreshBody
    );

    // ASSERT
    assert.strictEqual(refreshResponse.status, 200);
    assert.ok(refreshResponse.data.accessToken);
  });
  it("should return a 401 status when refresh token is missing", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: {
        firstname: "Bob",
        lastname: "Williams",
        email: "bob.williams@example.com",
        password: await argon2.hash("mySecretPwd!"),
        birthdate: new Date("1988-11-30"),
      },
    });
    const login = {
      email: "bob.williams@example.com",
      password: "mySecretPwd!",
    };
    const loginResponse = await httpRequest.post("/auth/login", login);
    const refreshBody = {
      refreshToken: "invalidOrExpiredToken",
    };

    // ACT
    const refreshResponse = await httpRequest.post(
      "/auth/refresh",
      refreshBody
    );

    // ASSERT
    assert.strictEqual(refreshResponse.status, 401);
  });
  it("should return a 401 status when refresh token is invalid", async () => {
    // ARRANGE
    const user = await prisma.user.create({
      data: {
        firstname: "Bob",
        lastname: "Williams",
        email: "bob.williams@example.com",
        password: await argon2.hash("mySecretPwd!"),
        birthdate: new Date("1988-11-30"),
      },
    });
    const login = {
      email: "bob.williams@example.com",
      password: "mySecretPwd!",
    };
    const loginResponse = await httpRequest.post("/auth/login", login);
    const refreshBody = {
      refreshToken: "invalidOrExpiredToken",
    };

    // ACT
    const refreshResponse = await httpRequest.post(
      "/auth/refresh",
      refreshBody
    );

    // ASSERT
    assert.strictEqual(refreshResponse.status, 401);
  });
});
