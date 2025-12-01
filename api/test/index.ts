import axios from "axios";
import { config } from "../config.ts";
import argon2 from "argon2";

const fakeId = 45;

export const fakeUser = {
  id: fakeId + 1,
  firstname: "Bob",
  lastname: "Williams",
  email: "bob.williams@example.com",
  password: await argon2.hash("mySecretPwd!"),
  birthdate: new Date("1988-11-30"),
};

export const httpRequest = axios.create({
  baseURL: `http://localhost:${config.port}/api`,
  validateStatus: () => true,
});
