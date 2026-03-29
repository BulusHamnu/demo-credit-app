// import { vi, expect, test, describe } from "vitest";

// // mocks
// let mockWhere = vi.fn().mockReturnThis();
// let mockFirst = vi.fn();
// let mockIncrement = vi.fn().mockResolvedValue(1);
// let mockDecrement = vi.fn().mockResolvedValue(1);
// let mockInsert = vi.fn().mockResolvedValue([1]);

// // trx mock
// let mockTrx = vi.fn((table) => ({
//   where: mockWhere,
//   first: mockFirst,
//   increment: mockIncrement,
//   decrement: mockDecrement,
//   insert: mockInsert,
// }));

// // db mock
// vi.mock("../../database/db.js", () => {
//   const dbMock: any = vi.fn((table) => ({
//     where: mockWhere,
//     first: mockFirst,
//     increment: mockIncrement,
//     decrement: mockDecrement,
//     insert: mockInsert,
//   }));

//   dbMock.transaction = vi.fn(async (cb) => {
//     await cb(mockTrx);
//   });

//   return { default: dbMock };
// });

// // helpers mock
// vi.mock("../../utils/helpers.js", () => ({
//   generateTransactionReference: vi.fn(() => "TNX_12345"),
// }));

// import {
//   transferFunds,
//   getUserTransactions,
//   tranferToWallet,
// } from "../../../src/services/transactions.service.js";
// import db from "../../../src/database/db.js";
// import AppError from "../../../src/errors/appError.js";

// describe("Transaction Service Tests", () => {
//   // transferFunds tests
//   test("Transfer funds: deposit", async () => {
//     mockWhere.mockClear();
//     mockFirst.mockClear();
//     mockIncrement.mockClear();
//     mockInsert.mockClear();

//     // mock wallet
//     mockFirst.mockResolvedValueOnce({
//       id: 10,
//       balance: 1000,
//       address: "wallet22334455",
//       user_id: 1,
//     });

//     const result = await transferFunds(200, "wallet22334455", "deposit", 1);

//     expect(mockWhere).toHaveBeenCalledWith({
//       address: "wallet22334455",
//       user_id: 1,
//     });
//     expect(mockIncrement).toHaveBeenCalledWith("balance", 200);
//     expect(mockInsert).toHaveBeenCalled();

//     expect(result).toBe(true);
//   });

//   test("Transfer funds: withdrawal insufficient balance", async () => {
//     mockFirst.mockClear();
//     mockFirst.mockResolvedValueOnce({
//       id: 10,
//       balance: 50,
//       address: "wallet22334455",
//       user_id: 1,
//     });

//     await expect(
//       transferFunds(100, "wallet22334455", "withdrawal", 1),
//     ).rejects.toThrow(AppError);
//   });

//   test("Transfer funds: wallet not found", async () => {
//     mockFirst.mockClear();
//     mockFirst.mockResolvedValueOnce(undefined);

//     await expect(
//       transferFunds(200, "wallet22334455", "deposit", 1),
//     ).rejects.toThrow(AppError);
//   });

//   // getUserTransactions tests
//   test("Get user transactions", async () => {
//     mockWhere.mockClear();

//     (db as any).mockReturnValueOnce({
//       where: mockWhere.mockResolvedValueOnce([
//         { id: 1, amount: 200, initiated_by: 1 },
//       ]),
//     });

//     const result = await getUserTransactions(1);

//     expect(db).toHaveBeenCalledWith("transactions");
//     expect(mockWhere).toHaveBeenCalledWith({ initiated_by: 1 });

//     expect(result).toEqual([{ id: 1, amount: 200, initiated_by: 1 }]);
//   });

//   // tranferToWallet tests
//   test("Transfer to wallet: successful", async () => {
//     mockFirst.mockClear();
//     mockWhere.mockClear();
//     mockIncrement.mockClear();
//     mockDecrement.mockClear();
//     mockInsert.mockClear();

//     // sender wallet
//     mockFirst.mockResolvedValueOnce({
//       id: 1,
//       balance: 500,
//       address: "SENDER123",
//     });

//     // receiver wallet
//     mockFirst.mockResolvedValueOnce({
//       id: 2,
//       balance: 100,
//       address: "RECEIVER999",
//     });

//     const result = await tranferToWallet(200, "RECEIVER999", "", 5);

//     expect(db).toHaveBeenCalledWith("wallets");
//     expect(mockWhere).toHaveBeenCalledWith({ address: "RECEIVER999" });
//     expect(mockDecrement).toHaveBeenCalledWith("balance", 200);
//     expect(mockIncrement).toHaveBeenCalledWith("balance", 200);
//     expect(mockInsert).toHaveBeenCalled();

//     expect(result).toBe(true);
//   });

//   test("Transfer to wallet: sender wallet not found", async () => {
//     mockFirst.mockClear();
//     mockFirst.mockResolvedValueOnce(undefined);

//     await expect(tranferToWallet(100, "fvsuvcusc", "", 10)).rejects.toThrow(
//       AppError,
//     );
//   });

//   test("Transfer to wallet: insufficient balance", async () => {
//     mockFirst.mockClear();
//     mockFirst.mockResolvedValueOnce({ id: 1, balance: 50 });

//     await expect(tranferToWallet(200, "any-wallet", "", 5)).rejects.toThrow(
//       AppError,
//     );
//   });

//   test("Transfer to wallet: receiver wallet not found", async () => {
//     mockFirst.mockClear();

//     mockFirst
//       .mockResolvedValueOnce({ id: 1, balance: 500 })
//       .mockResolvedValueOnce(undefined);

//     await expect(tranferToWallet(100, "UNKNOWN", "", 5)).rejects.toThrow(
//       AppError,
//     );
//   });

//   test("Transfer to wallet: same wallet error", async () => {
//     mockFirst.mockClear();

//     mockFirst
//       .mockResolvedValueOnce({ id: 1, balance: 500, address: "W1" })
//       .mockResolvedValueOnce({ id: 1, address: "W1" });

//     await expect(tranferToWallet(50, "W1", "", 5)).rejects.toThrow(AppError);
//   });
// });
