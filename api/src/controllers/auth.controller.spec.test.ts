import { describe, it } from "node:test";
import assert from "node:assert";
import { httpRequest } from "../../test/index.ts";
import { prisma } from "../models/index.ts";

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
