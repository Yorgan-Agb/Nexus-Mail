import axios from "axios";
import { config } from "../config.ts";
import { generateAccessToken } from "../src/lib/auth.ts";
import type { User } from "../src/models/index.ts";

let fakeId = 0;

export const fakeUser: User = {
  id: fakeId++,
  firstname: "Bob",
  lastname: "Williams",
  email: "bob.williams@example.com",
  password: "mySecretPwd!",
  birthdate: new Date("1988-11-30"),
  credit_ai: 100,
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const fakeAdminUser: User = {
  id: fakeId++,
  firstname: "Alice",
  lastname: "Johnson",
  email: "alice.johnson@example.com",
  password: "mySecretPwd!",
  birthdate: new Date("1985-05-15"),
  credit_ai: 200,
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const httpRequest = axios.create({
  baseURL: `http://localhost:${config.port}/api`,
  validateStatus: () => true,
});

export const buildAuthedRequester = (fakeUser: User) => {
  const token = generateAccessToken(fakeUser);
  return axios.create({
    baseURL: `http://localhost:${config.port}/api`,
    validateStatus: () => true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const authedRequester = buildAuthedRequester(fakeUser);
export const adminRequester = buildAuthedRequester(fakeAdminUser);
