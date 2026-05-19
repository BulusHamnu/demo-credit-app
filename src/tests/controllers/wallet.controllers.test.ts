import { vi, test, expect, describe, beforeEach } from "vitest";

vi.mock("../../services/wallet.service.js", () => ({
  createWallet: vi.fn(),
  getUserWallet: vi.fn(),
  depositFundsToWallet: vi.fn(),
  withdrawFundsFromWallet: vi.fn(),
  tranferToWallet: vi.fn(),
}));

import * as walletController from "../../controllers/wallet.controllers.js";

import * as walletService from "../../services/wallet.service.js";
import AppError, { ErrorCodes } from "../../errors/appError.js";

describe("Wallet controller tests", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    next = vi.fn();
  });

  describe("Create new wallet func", () => {
    test("Wallet created successfully", async () => {
      const req: any = {
        user: { id: 5 },
      };

      await walletController.createNewWallet(req, res, next);

      expect(walletService.createWallet).toHaveBeenCalledWith(5);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: "Wallet created successfully.",
      });

      expect(next).not.toHaveBeenCalled();
    });

    test("Wallet already exists", async () => {
      const req: any = {
        user: { id: 5 },
      };

      const dupError: any = new AppError(
        ErrorCodes.WALLET_ALREADY_EXISTS,
        "User already have a wallet.",
        409,
        true,
      );

      (walletService.createWallet as any).mockRejectedValue(dupError);

      await walletController.createNewWallet(req, res, next);

      expect(next).toHaveBeenCalledWith(dupError);

      expect(walletService.createWallet).toHaveBeenCalledWith(5);
      const error = (next as any).mock.calls[0][0];
      expect(error).toBeInstanceOf(AppError);
      expect(dupError.message).toBe("User already have a wallet.");
    });
  });

  describe("Get wallet func", () => {
    test("Wallet retrieved successfully", async () => {
      const req: any = {
        user: { id: 5 },
      };

      const wallet = {
        id: 1,
        balance: 5000,
        user_id: 5,
      };

      (walletService.getUserWallet as any).mockResolvedValue(wallet);

      await walletController.getWallet(req, res, next);

      expect(walletService.getUserWallet).toHaveBeenCalledWith(5);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: "Wallet retrieved successfully.",
        data: wallet,
      });

      expect(next).not.toHaveBeenCalled();
    });

    test("Should handle get wallet errors", async () => {
      const req: any = {
        user: { id: 5 },
      };

      const notFoundError = new AppError(
        ErrorCodes.WALLET_NOT_FOUND,
        "Wallet not found..",
        404,
        true,
      );

      (walletService.getUserWallet as any).mockRejectedValue(notFoundError);

      await walletController.getWallet(req, res, next);

      expect(walletService.getUserWallet).toHaveBeenCalledWith(5);

      expect(next).toHaveBeenCalledWith(notFoundError);
    });
  });

  describe("Deposit funds func", () => {
    test("Deposit successfully", async () => {
      const req: any = {
        user: { id: 5 },
        body: {
          amount: 5000,
          address: "3153e291-926e-4319-8086-0221280c7d78",
          notes: "deposit note",
        },
      };

      await walletController.depositFunds(req, res, next);

      expect(walletService.depositFundsToWallet).toHaveBeenCalledWith(
        5000,
        "3153e291-926e-4319-8086-0221280c7d78",
        5,
        "deposit note",
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: "Deposit of 5000 was successful.",
      });

      expect(next).not.toHaveBeenCalled();
    });

    test("Missing required fields", async () => {
      const req: any = {
        user: { id: 5 },
        body: {},
      };

      await walletController.depositFunds(req, res, next);

      expect(walletService.depositFundsToWallet).not.toHaveBeenCalled();

      expect(next).toHaveBeenCalled();

      const error = (next as any).mock.calls[0][0];
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Missing required fields.");
    });

    test("Should handle deposit errors", async () => {
      const req: any = {
        user: { id: 5 },
        body: {
          amount: 5000,
          address: "wallet-address",
        },
      };

      const walletNotFoundError = new AppError(
        ErrorCodes.WALLET_NOT_FOUND,
        "Wallet not found..",
        404,
        true,
      );

      (walletService.depositFundsToWallet as any).mockRejectedValue(
        walletNotFoundError,
      );

      await walletController.depositFunds(req, res, next);
      expect(next).toHaveBeenCalledWith(walletNotFoundError);
    });
  });

  describe("Withdraw funds func", () => {
    test("Withdrawal successfully", async () => {
      const req: any = {
        user: { id: 5 },
        body: {
          amount: 2000,
          address: "3153e291-926e-4319-8086-0221280c7d78",
          notes: "withdraw note",
        },
      };

      await walletController.withdrawFunds(req, res, next);

      expect(walletService.withdrawFundsFromWallet).toHaveBeenCalledWith(
        2000,
        "3153e291-926e-4319-8086-0221280c7d78",
        5,
        "withdraw note",
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: "Withdrawal of 2000 was successfully.",
      });

      expect(next).not.toHaveBeenCalled();
    });

    test("Missing required fields", async () => {
      const req: any = {
        user: { id: 5 },
        body: {},
      };

      await walletController.withdrawFunds(req, res, next);

      expect(walletService.withdrawFundsFromWallet).not.toHaveBeenCalled();

      expect(next).toHaveBeenCalled();

      const error = (next as any).mock.calls[0][0];
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Missing required fields.");
    });

    test("Should handle withdrawal errors", async () => {
      const req: any = {
        user: { id: 5 },
        body: {
          amount: 2000,
          address: "3153e291-926e-4319-8086-0221280c7d78",
        },
      };

      const walletNotFound = new AppError(
        ErrorCodes.WALLET_NOT_FOUND,
        "Wallet not found.",
        404,
        true,
      );

      (walletService.withdrawFundsFromWallet as any).mockRejectedValue(
        walletNotFound,
      );

      await walletController.withdrawFunds(req, res, next);
      expect(next).toHaveBeenCalledWith(walletNotFound);
    });
  });

  describe("Transfer funds func", () => {
    test("Transfer successfully", async () => {
      const req: any = {
        user: { id: 5 },
        body: {
          amount: 1000,
          address: "3153e291-926e-4319-8086-0221280c7d78",
          notes: "transfer note",
        },
      };

      await walletController.transferFunds(req, res, next);

      expect(walletService.tranferToWallet).toHaveBeenCalledWith(
        1000,
        "3153e291-926e-4319-8086-0221280c7d78",
        5,
        "transfer note",
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: "Transfer was successful.",
      });

      expect(next).not.toHaveBeenCalled();
    });

    test("Missing required fields", async () => {
      const req: any = {
        user: { id: 5 },
        body: {},
      };

      await walletController.transferFunds(req, res, next);

      expect(walletService.tranferToWallet).not.toHaveBeenCalled();

      expect(next).toHaveBeenCalled();

      const error = (next as any).mock.calls[0][0];
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Missing required fields.");
    });

    test("Should handle transfer errors", async () => {
      const req: any = {
        user: { id: 5 },
        body: {
          amount: 1000,
          address: "3153e291-926e-4319-8086-0221280c7d78",
        },
      };

      const invalidTransfer = new AppError(
        ErrorCodes.TRANSFER_INVALID,
        "You can not tranfer funds to yourself.",
        400,
        true,
      );

      (walletService.tranferToWallet as any).mockRejectedValue(invalidTransfer);

      await walletController.transferFunds(req, res, next);
      expect(next).toHaveBeenCalledWith(invalidTransfer);
    });
  });
});
