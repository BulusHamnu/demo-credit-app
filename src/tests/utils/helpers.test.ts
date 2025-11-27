import { test, expect, describe } from "vitest";
import {
  generateAccessToken,
  generateTransactionReference,
} from "../../utils/helpers.js";

describe("Helper Functions test", () => {
  test("Generate Access Token", () => {
    const token = generateAccessToken();
    // token is a type of string
    expect(typeof token).toBe("string");
  });

  test("Generate Transaction Reference", () => {
    const ref = generateTransactionReference();
    // returned a type of string
    expect(typeof ref).toBe("string");
    expect(ref).includes("TNX_");
  });
});
