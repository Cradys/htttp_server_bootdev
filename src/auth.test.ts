import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "./api/auth.js";
import { Unauthorized } from "./api/error_classes.js";
import { Request } from "express";

// describe("Password Hashing", () => {
//   const password1 = "correctPassword123!";
//   const password2 = "anotherPassword456!";
//   let hash1: string;
//   let hash2: string;

//   beforeAll(async () => {
//     hash1 = await hashPassword(password1);
//     hash2 = await hashPassword(password2);
//   });

//   it("should return true for the correct password", async () => {
//     const result = await checkPasswordHash(password1, hash1);
//     expect(result).toBe(true);
//   });
// });


describe("JWT Functions", () => {
  const secret = "secret";
  const wrongSecret = "wrong_secret";
  const userID = "some-unique-user-id";
  let validToken: string;

  beforeAll(() => {
    validToken = makeJWT(userID, 3600);
  });

  it("should validate a valid token", () => {
    const result = validateJWT(validToken);
    expect(result).toBe(userID);
  });

  it("should throw an error for an invalid token string", () => {
    expect(() => validateJWT("invalid.token.string")).toThrow(
      Unauthorized,
    );
  });

  it("should throw an error when the token is signed with a wrong secret", () => {
    expect(() => validateJWT(validToken)).toThrow(
      Unauthorized,
    );
  });
});

describe("Get bearer token from header", () => {
})