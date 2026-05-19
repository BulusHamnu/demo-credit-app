import { vi, test, expect, describe, beforeEach } from "vitest";

const insertMock = vi.fn();
const whereMock = vi.fn();

vi.mock("../../database/db.js", () => ({
  default: vi.fn(() => ({
    insert: insertMock,
    where: whereMock,
  })),
}));

vi.mock("../../utils/helpers.js", () => ({
  generateTransactionReference: vi.fn(),
}));

import * as transactionService from "../../services/transactions.service.js";
import { generateTransactionReference } from "../../utils/helpers.js";

describe("Transaction service tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Record transaction func", () => {
    test("Transaction recorded successfully", async () => {
      const fakeDb: any = vi.fn(() => ({
        insert: insertMock,
      }));

      (generateTransactionReference as any).mockReturnValue(
        "TNX_123456FHR454RDFDF45TTFFE3E3",
      );

      insertMock.mockResolvedValue([1]);

      await transactionService.recordTransaction({
        db: fakeDb,
        userId: 5,
        amount: 5000,
        receiverWalletId: 2,
        senderWalletId: 1,
        type: "deposit",
        notes: "deposit note",
      });

      expect(generateTransactionReference).toHaveBeenCalled();

      expect(insertMock).toHaveBeenCalledWith({
        amount: 5000,
        receiver_wallet_id: 2,
        sender_wallet_id: 1,
        type: "deposit",
        notes: "deposit note",
        reference: "TNX_123456FHR454RDFDF45TTFFE3E3",
        initiated_by: 5,
      });
    });

    test("Should handle transaction record errors", async () => {
      const fakeDb: any = vi.fn(() => ({
        insert: insertMock,
      }));

      const databaseError = new Error("Database crashed");

      insertMock.mockRejectedValue(databaseError);

      await expect(
        transactionService.recordTransaction({
          db: fakeDb,
          userId: 5,
          amount: 5000,
          receiverWalletId: 2,
          senderWalletId: 1,
          type: "deposit",
          notes: "deposit note",
        }),
      ).rejects.toThrow("Database crashed");
    });
  });

  describe("Get user transactions func", () => {
    test("Transactions retrieved successfully", async () => {
      const transactions = [
        {
          id: 1,
          amount: 5000,
          initiated_by: 5,
          type: "deposit",
        },
        {
          id: 2,
          amount: 2000,
          initiated_by: 5,
          type: "withdrawal",
        },
      ];

      whereMock.mockResolvedValue(transactions);

      const result = await transactionService.getUserTransactions(5);
      expect(whereMock).toHaveBeenCalledWith({
        initiated_by: 5,
      });

      expect(result).toEqual(transactions);
    });

    test("Should handle database errors", async () => {
      const databaseError = new Error("Database crashed");

      whereMock.mockRejectedValue(databaseError);
      await expect(transactionService.getUserTransactions(5)).rejects.toThrow(
        "Database crashed",
      );
    });
  });
});
