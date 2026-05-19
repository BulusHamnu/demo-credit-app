import { describe, test, expect } from "vitest";

import {
  generateAccessToken,
  generateTransactionReference,
} from "../../utils/helpers.js";

describe("Generate token utils tests", () => {
  describe("generateAccessToken func", () => {
    test("Should generate access token", () => {
      const token = generateAccessToken();

      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe("generateTransactionReference func", () => {
    test("Should generate transaction reference", () => {
      const reference = generateTransactionReference();

      expect(typeof reference).toBe("string");
      expect(reference.startsWith("TNX_")).toBe(true);
      expect(reference.length).toBeGreaterThan(4);
    });
  });
});
