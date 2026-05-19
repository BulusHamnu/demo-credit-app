import { vi, test, expect, describe, beforeEach } from "vitest";

vi.mock("../../services/transactions.service.js", () => ({
  getUserTransactions: vi.fn(),
}));

import * as transactionController from "../../controllers/transaction.controllers.js";
import * as transactionService from "../../services/transactions.service.js";

describe("Transaction controller tests", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {};

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    next = vi.fn();
  });

  describe("Get transactions func", () => {
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

      req = {
        user: {
          id: 5,
        },
      };

      (transactionService.getUserTransactions as any).mockResolvedValue(
        transactions,
      );

      await transactionController.getTransactions(req, res, next);

      expect(transactionService.getUserTransactions).toHaveBeenCalledWith(5);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: "Transactions retrieved successfully.",
        data: transactions,
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("Should handle transaction retrieval errors", async () => {
      req = {
        user: {
          id: 5,
        },
      };

      const databaseError = new Error("Database crashed");
      (transactionService.getUserTransactions as any).mockRejectedValue(
        databaseError,
      );

      await transactionController.getTransactions(req, res, next);

      expect(transactionService.getUserTransactions).toHaveBeenCalledWith(5);
      expect(next).toHaveBeenCalledWith(databaseError);
    });
  });
});
