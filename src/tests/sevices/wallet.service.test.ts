import { vi, test, expect, describe, beforeEach } from "vitest";

const { insertMock, firstMock, whereMock, transactionMock } = vi.hoisted(() => {
  const firstMock = vi.fn();

  const incrementMock = vi.fn();

  const decrementMock = vi.fn();

  const forUpdateMock = vi.fn(() => ({
    first: firstMock,
  }));

  const whereMock = vi.fn(() => ({
    first: firstMock,
    increment: incrementMock,
    decrement: decrementMock,
    forUpdate: forUpdateMock,
  }));

  return {
    insertMock: vi.fn(),
    firstMock,
    whereMock,
    incrementMock,
    decrementMock,
    forUpdateMock,
    transactionMock: vi.fn(),
  };
});

vi.mock("../../database/db.js", () => ({
  default: Object.assign(
    vi.fn(() => ({
      insert: insertMock,
      where: whereMock,
    })),
    {
      transaction: transactionMock,
    },
  ),
}));

vi.mock("../../services/transactions.service.js", () => ({
  recordTransaction: vi.fn(),
  TransactionType: {
    deposit: "deposit",
    withdrawal: "withdrawal",
    transfer: "transfer",
  },
}));

import * as walletService from "../../services/wallet.service.js";
import { recordTransaction } from "../../services/transactions.service.js";
import AppError, { ErrorCodes } from "../../errors/appError.js";
import crypto from "crypto";

describe("Wallet service tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(crypto, "randomBytes").mockReturnValue({
      toString: vi.fn(() => "1422b32f4fe3009127b78c0766388533"),
    } as any);
  });

  describe("Create wallet func", () => {
    test("Wallet created successfully", async () => {
      insertMock.mockResolvedValue([1]);

      await walletService.createWallet(5);

      expect(insertMock).toHaveBeenCalledWith({
        user_id: 5,
        address: "1422b32f4fe3009127b78c0766388533",
      });
    });

    test("Should handle database errors", async () => {
      const databaseError = new Error("Database crashed");

      insertMock.mockRejectedValue(databaseError);

      await expect(walletService.createWallet(5)).rejects.toThrow(
        "Database crashed",
      );
    });
  });

  describe("Get user wallet func", () => {
    test("Wallet retrieved successfully", async () => {
      const wallet = {
        id: 1,
        balance: 5000,
        address: "1422b32f4fe3009127b78c0766388533",
        user_id: 5,
      };

      firstMock.mockResolvedValue(wallet);

      const result = await walletService.getUserWallet(5);

      expect(whereMock).toHaveBeenCalledWith({
        user_id: 5,
      });
      expect(result).toEqual(wallet);
    });

    test("Wallet not found", async () => {
      firstMock.mockResolvedValue(undefined);

      await expect(walletService.getUserWallet(5)).rejects.toBeInstanceOf(
        AppError,
      );

      await expect(walletService.getUserWallet(5)).rejects.toMatchObject({
        message: "Wallet not found.",
        code: ErrorCodes.WALLET_NOT_FOUND,
      });
    });
  });

  describe("Deposit funds func", () => {
    test("Deposit successfully", async () => {
      const wallet = {
        id: 1,
        balance: 5000,
        address: "1422b32f4fe3009127b78c0766388533s",
        user_id: 5,
      };

      firstMock.mockResolvedValue(wallet);

      transactionMock.mockImplementation(async (callback: any) => {
        const trx = vi.fn(() => ({
          where: whereMock,
        }));

        await callback(trx);
      });

      await walletService.depositFundsToWallet(
        5000,
        "1422b32f4fe3009127b78c0766388533",
        5,
        "deposit note",
      );

      expect(whereMock).toHaveBeenCalledWith({
        address: "1422b32f4fe3009127b78c0766388533",
        user_id: 5,
      });

      expect(recordTransaction).toHaveBeenCalled();
    });

    test("Amount less than minimum", async () => {
      await expect(
        walletService.depositFundsToWallet(
          50,
          "1422b32f4fe3009127b78c0766388533",
          5,
        ),
      ).rejects.toBeInstanceOf(AppError);

      await expect(
        walletService.depositFundsToWallet(
          50,
          "1422b32f4fe3009127b78c0766388533",
          5,
        ),
      ).rejects.toMatchObject({
        message: "Amount can not be less than 100.",
        code: ErrorCodes.AMOUNT_INVALID,
      });
    });

    test("Wallet not found", async () => {
      firstMock.mockResolvedValue(undefined);

      await expect(
        walletService.depositFundsToWallet(
          5000,
          "1422b32f4fe3009127b78c0766388533",
          5,
        ),
      ).rejects.toBeInstanceOf(AppError);

      await expect(
        walletService.depositFundsToWallet(
          5000,
          "1422b32f4fe3009127b78c0766388533",
          5,
        ),
      ).rejects.toMatchObject({
        message: "Wallet not found.",
        code: ErrorCodes.WALLET_NOT_FOUND,
      });
    });
  });

  describe("Withdraw funds func", () => {
    test("Withdrawal successfully", async () => {
      const wallet = {
        id: 1,
        balance: 10000,
        address: "1422b32f4fe3009127b78c0766388533",
        user_id: 5,
      };

      firstMock.mockResolvedValue(wallet);

      transactionMock.mockImplementation(async (callback: any) => {
        const trx = vi.fn(() => ({
          where: whereMock,
        }));

        await callback(trx);
      });

      await walletService.withdrawFundsFromWallet(
        2000,
        "1422b32f4fe3009127b78c0766388533",
        5,
        "withdraw note",
      );

      expect(recordTransaction).toHaveBeenCalled();
    });

    test("Insufficient funds", async () => {
      const wallet = {
        id: 1,
        balance: 500,
        address: "1422b32f4fe3009127b78c0766388533",
        user_id: 5,
      };

      firstMock.mockResolvedValue(wallet);

      transactionMock.mockImplementation(async (callback: any) => {
        const trx = vi.fn(() => ({
          where: whereMock,
        }));

        await callback(trx);
      });

      await expect(
        walletService.withdrawFundsFromWallet(
          2000,
          "1422b32f4fe3009127b78c0766388533",
          5,
        ),
      ).rejects.toBeInstanceOf(AppError);

      await expect(
        walletService.withdrawFundsFromWallet(
          2000,
          "1422b32f4fe3009127b78c0766388533",
          5,
        ),
      ).rejects.toMatchObject({
        message: "Insufficient funds",
        code: ErrorCodes.INSUFFICIENT_FUNDS,
      });
    });
  });

  describe("Transfer funds func", () => {
    test("Transfer successfully", async () => {
      const receiverWallet = {
        id: 2,
        balance: 3000,
        address: "1422b32f4fe3009127b78c0766388533",
      };

      const senderWallet = {
        id: 1,
        balance: 10000,
        address: "94947egd9ed093077304783683648634",
      };

      firstMock
        .mockResolvedValueOnce(receiverWallet)
        .mockResolvedValueOnce(senderWallet);

      transactionMock.mockImplementation(async (callback: any) => {
        const trx = vi.fn(() => ({
          where: whereMock,
        }));

        await callback(trx);
      });

      await walletService.tranferToWallet(
        2000,
        "1422b32f4fe3009127b78c0766388533t",
        5,
        "transfer note",
      );

      expect(recordTransaction).toHaveBeenCalled();
    });

    test("Recipient wallet not found", async () => {
      firstMock.mockResolvedValue(undefined);

      await expect(
        walletService.tranferToWallet(
          2000,
          "1422b32f4fe3009127b78c0766388533",
          5,
        ),
      ).rejects.toBeInstanceOf(AppError);

      await expect(
        walletService.tranferToWallet(
          2000,
          "1422b32f4fe3009127b78c0766388533",
          5,
        ),
      ).rejects.toMatchObject({
        message: "Recipient wallet not found.",
        code: ErrorCodes.WALLET_NOT_FOUND,
      });
    });

    test("Can not transfer to yourself", async () => {
      const receiverWallet = {
        id: 2,
        balance: 3000,
        address: "1422b32f4fe3009127b78c0766388533",
      };

      const senderWallet = {
        id: 1,
        balance: 10000,
        address: "1422b32f4fe3009127b78c0766388533",
      };

      firstMock
        .mockResolvedValueOnce(receiverWallet)
        .mockResolvedValueOnce(senderWallet);

      transactionMock.mockImplementation(async (callback: any) => {
        const trx = vi.fn(() => ({
          where: whereMock,
        }));

        await callback(trx);
      });

      const error = await walletService
        .tranferToWallet(2000, "1422b32f4fe3009127b78c0766388533", 5)
        .catch((err) => err);

      expect(error).toBeInstanceOf(AppError);

      expect(error).toMatchObject({
        message: "You can not tranfer funds to yourself.",
        code: ErrorCodes.TRANSFER_INVALID,
      });
    });
  });
});
