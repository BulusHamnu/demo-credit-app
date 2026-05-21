import { vi, test, expect, describe, beforeEach } from "vitest";

const insertMock = vi.fn();
const firstMock = vi.fn();
const whereMock = vi.fn(() => ({
  first: firstMock,
}));

vi.mock("../../database/db.js", () => ({
  default: vi.fn(() => ({
    insert: insertMock,
    where: whereMock,
  })),
}));

vi.mock("../../utils/helpers.js", () => ({
  generateAccessToken: vi.fn(),
}));

vi.mock("../../services/verifyKarmaIdentity.js", () => ({
  default: vi.fn(),
}));

import * as authService from "../../services/auth.service.js";
import { generateAccessToken } from "../../utils/helpers.js";
import AppError, { ErrorCodes } from "../../errors/appError.js";
import verifyKarmaIdentity from "../../services/verifyKarmaIdentity.js";

describe("Auth service tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (verifyKarmaIdentity as any).mockResolvedValue(true);
  });

  describe("Create new user func", () => {
    test("User created successfully", async () => {
      (generateAccessToken as any).mockReturnValue(
        "3153e291-926e-4319-8086-0221280c7d78",
      );

      insertMock.mockResolvedValue([5]);

      await authService.createNewUser("hamnu@gmail.com", "Bulus Hamnu");

      expect(generateAccessToken).toHaveBeenCalled();

      expect(insertMock).toHaveBeenCalledWith({
        email: "hamnu@gmail.com",
        full_name: "Bulus Hamnu",
        token: "3153e291-926e-4319-8086-0221280c7d78",
      });
    });

    test("User already exists", async () => {
      const dupError: any = {
        errno: 1062,
      };

      insertMock.mockRejectedValue(dupError);

      await expect(
        authService.createNewUser("hamnu@gmail.com", "Bulus Hamnu"),
      ).rejects.toBeInstanceOf(AppError);

      await expect(
        authService.createNewUser("hamnu@gmail.com", "Bulus Hamnu"),
      ).rejects.toMatchObject({
        message: "User already exists.",
        code: ErrorCodes.USER_ALREADY_EXISTS,
      });
    });

    test("User blacklisted", async () => {
      (verifyKarmaIdentity as any).mockResolvedValue(false);

      await expect(
        authService.createNewUser("hamnu@gmail.com", "Bulus Hamnu"),
      ).rejects.toMatchObject({
        code: ErrorCodes.USER_BLACKLISTED,
      });
    });

    test("Should throw unknown database errors", async () => {
      const databaseError = new Error("Database crashed");

      insertMock.mockRejectedValue(databaseError);

      await expect(
        authService.createNewUser("hamnu@gmail.com", "Bulus Hamnu"),
      ).rejects.toThrow("Database crashed");
    });
  });

  describe("Retrieve user token func", () => {
    test("User token retrieved successfully", async () => {
      firstMock.mockResolvedValue({
        id: 5,
        email: "hamnu@gmail.com",
        token: "3153e291-926e-4319-8086-0221280c7d78",
      });

      const result = await authService.retrieveUserToken("hamnu@gmail.com");

      expect(whereMock).toHaveBeenCalledWith({
        email: "hamnu@gmail.com",
      });
      expect(result).toBe("3153e291-926e-4319-8086-0221280c7d78");
    });

    test("User not found", async () => {
      firstMock.mockResolvedValue(undefined);

      await expect(
        authService.retrieveUserToken("hamnu@gmail.com"),
      ).rejects.toBeInstanceOf(AppError);

      await expect(
        authService.retrieveUserToken("hamnu@gmail.com"),
      ).rejects.toMatchObject({
        message: "User not found.",
        code: ErrorCodes.USER_NOT_FOUND,
      });
    });

    test("Should handle database errors", async () => {
      const fakeError = new Error("Database crashed");

      firstMock.mockRejectedValue(fakeError);

      await expect(
        authService.retrieveUserToken("hamnu@gmail.com"),
      ).rejects.toThrow("Database crashed");
    });
  });
});
