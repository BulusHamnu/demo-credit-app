import { vi, test, expect, describe } from "vitest";

vi.mock("../../services/auth.service.js", () => ({
  createNewUser: vi.fn(),
  getUser: vi.fn(),
}));

import {
  registerController,
  loginController,
} from "../../controllers/auth.controllers.js";

import { createNewUser, getUser } from "../../services/auth.service.js";

import AppError from "../../errors/appError.js";

const mockedCreateUser = createNewUser as any;
const mockedGetUser = getUser as any;

describe("Auth Controller Tests", () => {
  test("Register: successful registration", async () => {
    mockedCreateUser.mockClear();

    const req: any = {
      body: {
        full_name: "Bulus Hamnu",
        email: "hamnu@gmail.com",
      },
    };

    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const res: any = { status };
    const next = vi.fn();

    await registerController(req, res, next);

    expect(mockedCreateUser).toHaveBeenCalledWith(
      "hamnu@gmail.com",
      "Bulus Hamnu"
    );

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      status: true,
      message: "User created succesfully",
    });

    expect(next).not.toHaveBeenCalled();
  });

  test("Register: missing required fields", async () => {
    mockedCreateUser.mockClear();

    const req: any = {
      body: {
        full_name: "",
        email: "",
      },
    };

    const res: any = {};
    const next = vi.fn();

    await registerController(req, res, next);

    expect(next).toHaveBeenCalled();

    const error = (next as any).mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
  });

  test("Login: successful", async () => {
    mockedGetUser.mockClear();

    mockedGetUser.mockResolvedValueOnce({
      token: "3153e291-926e-4319-8086-0221280c7d78",
    });

    const req: any = {
      body: {
        email: "hamnu@gmail.com",
      },
    };

    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const res: any = { status };
    const next = vi.fn();

    await loginController(req, res, next);

    expect(mockedGetUser).toHaveBeenCalledWith("hamnu@gmail.com");

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      status: true,
      message: "User logged in succesfully",
      data: {
        token: "3153e291-926e-4319-8086-0221280c7d78", // 3153e291-926e-4319-8086-0221280c7d78
      },
    });

    expect(next).not.toHaveBeenCalled();
  });

  test("Login: missing email", async () => {
    mockedGetUser.mockClear();

    const req: any = {
      body: {
        email: "",
      },
    };

    const res: any = {};
    const next = vi.fn();

    await loginController(req, res, next);

    expect(next).toHaveBeenCalled();

    const error = (next as any).mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
  });
});
