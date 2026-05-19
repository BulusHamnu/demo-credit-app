import { vi, test, expect, describe, beforeEach } from "vitest";

vi.mock("../../services/auth.service.js", () => ({
  createNewUser: vi.fn(),
  retrieveUserToken: vi.fn(),
}));

import { signup, login } from "../../../src/controllers/auth.controllers.js";

import {
  createNewUser,
  retrieveUserToken,
} from "../../../src/services/auth.service.js";

import AppError from "../../errors/appError.js";

describe("Auth Controller Tests", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    next = vi.fn();
  });

  describe("Sign up func tests", () => {
    test("Sign up successfully", async () => {
      req = {
        body: {
          fullname: "Bulus Hamnu",
          email: "hamnu@gmail.com",
        },
      };

      await signup(req, res, next);

      expect(createNewUser).toHaveBeenCalledWith(
        "hamnu@gmail.com",
        "Bulus Hamnu",
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: "User created successfully.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("Missing required fields", async () => {
      const req: any = {
        body: {
          fullname: "",
          email: "",
        },
      };

      await signup(req, res, next);

      expect(createNewUser).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();

      const error = (next as any).mock.calls[0][0];
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Missing required fields.");
    });

    test("Should handle createNewUser func errors", async () => {
      req.body = {
        fullname: "Bulus",
        email: "hamnu@gmail.com",
      };

      const userExistsError = new Error("User already exists.");
      (createNewUser as any).mockRejectedValue(userExistsError);

      await signup(req, res, next);
      expect(next).toHaveBeenCalledWith(userExistsError);
    });
  });

  describe("Login func tests", async () => {
    test("Login successfully", async () => {
      (retrieveUserToken as any).mockResolvedValue(
        "3153e291-926e-4319-8086-0221280c7d78",
      );

      const req: any = {
        body: {
          email: "hamnu@gmail.com",
        },
      };

      await login(req, res, next);

      expect(retrieveUserToken).toHaveBeenCalledWith("hamnu@gmail.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: "User logged in successfully.",
        data: {
          token: "3153e291-926e-4319-8086-0221280c7d78",
        },
      });

      expect(next).not.toHaveBeenCalled();
    });

    test("Missing required field email", async () => {
      const req: any = {
        body: {
          email: "",
        },
      };

      await login(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(retrieveUserToken).not.toHaveBeenCalled();

      const error = (next as any).mock.calls[0][0];
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Missing required fields.");
    });

    test("Should handle retrieveUserToken func errors", async () => {
      req.body = {
        fullname: "Bulus",
        email: "hamnu@gmail.com",
      };

      const notFoundError = new Error("User not found.");
      (retrieveUserToken as any).mockRejectedValue(notFoundError);

      await login(req, res, next);
      expect(next).toHaveBeenCalledWith(notFoundError);
    });
  });
});
