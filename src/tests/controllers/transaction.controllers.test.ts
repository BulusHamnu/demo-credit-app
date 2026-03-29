// import { vi, test, expect, describe } from "vitest";

// // mock all transaction services
// vi.mock("../../services/transactions.service.js", () => ({
//   transferFunds: vi.fn(),
//   getUserTransactions: vi.fn(),
//   tranferToWallet: vi.fn(),
// }));

// import {
//   depositController,
//   getTransactionsController,
//   transferController,
//   withdrawController,
// } from "../../../src/controllers/transaction.controllers.js";

// import {
//   transferFunds,
//   getUserTransactions,
//   tranferToWallet,
// } from "../../../src/services/transactions.service.js";

// import AppError from "../../../src/errors/appError.js";

// const mockedTransferFunds = transferFunds as unknown as ReturnType<
//   typeof vi.fn
// >;
// const mockedGetUserTransactions = getUserTransactions as unknown as ReturnType<
//   typeof vi.fn
// >;
// const mockedTransferToWallet = tranferToWallet as unknown as ReturnType<
//   typeof vi.fn
// >;

// describe("Transaction Controller Tests", () => {
//   // Deposit Tests
//   test("Deposit: successful", async () => {
//     mockedTransferFunds.mockClear();

//     const req: any = {
//       user: { id: 10 },
//       body: {
//         amount: 500,
//         address: "8350a25d32394bbcb95464f73537c377",
//         notes: "Test deposit",
//       },
//     };

//     const json = vi.fn();
//     const status = vi.fn(() => ({ json }));
//     const res: any = { status };
//     const next = vi.fn();

//     await depositController(req, res, next);

//     expect(mockedTransferFunds).toHaveBeenCalledWith(
//       500,
//       "8350a25d32394bbcb95464f73537c377",
//       "deposit",
//       10,
//     );

//     expect(status).toHaveBeenCalledWith(200);
//     expect(json).toHaveBeenCalledWith({
//       status: true,
//       message: "Deposit of 500 was successful.",
//     });

//     expect(next).not.toHaveBeenCalled();
//   });

//   test("Deposit: missing fields", async () => {
//     mockedTransferFunds.mockClear();

//     const req: any = {
//       user: { id: 10 },
//       body: {
//         amount: null,
//         address: "",
//       },
//     };

//     const next = vi.fn();
//     const res: any = {};

//     await depositController(req, res, next);

//     expect(next).toHaveBeenCalled();
//     const error = (next as any).mock.calls[0][0];
//     expect(error).toBeInstanceOf(AppError);
//   });

//   // Get User Transactions Tests
//   test("Get Transactions: successful", async () => {
//     mockedGetUserTransactions.mockClear();

//     mockedGetUserTransactions.mockResolvedValueOnce([
//       { id: 1, amount: 200 },
//       { id: 2, amount: 500 },
//     ]);

//     const req: any = { user: { id: 10 } };
//     const json = vi.fn();
//     const status = vi.fn(() => ({ json }));
//     const res: any = { status };
//     const next = vi.fn();

//     await getTransactionsController(req, res, next);

//     expect(mockedGetUserTransactions).toHaveBeenCalledWith(10);

//     expect(status).toHaveBeenCalledWith(200);
//     expect(json).toHaveBeenCalledWith({
//       status: true,
//       message: "Transactions retrived successfully.",
//       data: [
//         { id: 1, amount: 200 },
//         { id: 2, amount: 500 },
//       ],
//     });

//     expect(next).not.toHaveBeenCalled();
//   });

//   // Transfer Tests
//   test("Transfer: successful", async () => {
//     mockedTransferToWallet.mockClear();

//     const req: any = {
//       user: { id: 7 },
//       body: {
//         amount: 300,
//         address: "8350a25d32394bbcb95464f73537c377",
//         notes: "test transfer",
//       },
//     };

//     const json = vi.fn();
//     const status = vi.fn(() => ({ json }));
//     const res: any = { status };
//     const next = vi.fn();

//     await transferController(req, res, next);

//     expect(mockedTransferToWallet).toHaveBeenCalledWith(
//       300,
//       "8350a25d32394bbcb95464f73537c377",
//       "test transfer",
//       7,
//     );

//     expect(status).toHaveBeenCalledWith(200);
//     expect(json).toHaveBeenCalledWith({
//       status: true,
//       message: "Transfer was successful.",
//     });

//     expect(next).not.toHaveBeenCalled();
//   });

//   test("Transfer: missing fields", async () => {
//     mockedTransferToWallet.mockClear();

//     const req: any = {
//       user: { id: 7 },
//       body: {
//         amount: null,
//         address: "",
//         notes: "",
//       },
//     };

//     const res: any = {};
//     const next = vi.fn();

//     await transferController(req, res, next);

//     expect(next).toHaveBeenCalled();
//     const error = (next as any).mock.calls[0][0];
//     expect(error).toBeInstanceOf(AppError);
//   });

//   // Withdrawal Tests
//   test("Withdrawal: successful", async () => {
//     mockedTransferFunds.mockClear();

//     const req: any = {
//       user: { id: 20 },
//       body: {
//         amount: 450,
//         address: "8350a25d32394bbcb95464f73537c377",
//       },
//     };

//     const json = vi.fn();
//     const status = vi.fn(() => ({ json }));
//     const res: any = { status };
//     const next = vi.fn();

//     await withdrawController(req, res, next);

//     expect(mockedTransferFunds).toHaveBeenCalledWith(
//       450,
//       "8350a25d32394bbcb95464f73537c377",
//       "withdrawal",
//       20,
//     );

//     expect(status).toHaveBeenCalledWith(200);
//     expect(json).toHaveBeenCalledWith({
//       status: true,
//       message: "Withdrawal was successfully.",
//     });

//     expect(next).not.toHaveBeenCalled();
//   });

//   test("Withdrawal: missing fields", async () => {
//     mockedTransferFunds.mockClear();

//     const req: any = {
//       user: { id: 20 },
//       body: {
//         amount: null,
//         address: "",
//       },
//     };

//     const res: any = {};
//     const next = vi.fn();

//     await withdrawController(req, res, next);

//     expect(next).toHaveBeenCalled();
//     const error = (next as any).mock.calls[0][0];
//     expect(error).toBeInstanceOf(AppError);
//   });
// });
