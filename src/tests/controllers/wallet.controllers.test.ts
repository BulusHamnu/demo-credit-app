// import { vi, test, expect, describe } from "vitest";

// // mock db()
// let mockWhere = vi.fn().mockReturnThis();
// let mockFirst = vi.fn();
// let mockInsert = vi.fn().mockResolvedValue([1]);

// vi.mock("../../database/db.js", () => {
//   const fn: any = vi.fn(() => ({
//     where: mockWhere,
//     first: mockFirst,
//     insert: mockInsert,
//   }));

//   return { default: fn };
// });

// const mockedDb = db as any;

// import {
//   createNewWalletController,
//   getUserWalletController,
// } from "../../../src/controllers/wallet.controllers.js";

// import db from "../../../src/database/db.js";
// import AppError from "../../../src/errors/appError.js";
// import crypto from "crypto";

// // mock crypto.randomBytes
// vi.spyOn(crypto, "randomBytes").mockImplementation(() => ({
//   toString: () => "8350a25d32394bbcb95464f73537c377",
// }));

// describe("Wallet Controller Tests", () => {
//   // Create wallet
//   test("Create wallet: successful", async () => {
//     mockWhere.mockClear();
//     mockFirst.mockClear();
//     mockInsert.mockClear();

//     mockFirst.mockResolvedValueOnce(undefined);

//     const req: any = {
//       user: { id: 5 },
//     };

//     const json = vi.fn();
//     const status = vi.fn(() => ({ json }));
//     const res: any = { status };
//     const next = vi.fn();

//     await createNewWalletController(req, res, next);

//     expect(mockedDb).toHaveBeenCalledWith("wallets");
//     expect(mockWhere).toHaveBeenCalledWith({ user_id: 5 });
//     expect(mockInsert).toHaveBeenCalledWith({
//       user_id: 5,
//       address: "8350a25d32394bbcb95464f73537c377",
//     });

//     expect(status).toHaveBeenCalledWith(201);
//     expect(json).toHaveBeenCalledWith({
//       status: true,
//       message: "New wallet created successfully.",
//     });

//     expect(next).not.toHaveBeenCalled();
//   });

//   test("Create wallet: wallet exists", async () => {
//     mockWhere.mockClear();
//     mockFirst.mockClear();

//     mockFirst.mockResolvedValueOnce({ id: 1 });

//     const req: any = {
//       user: { id: 5 },
//     };

//     const res: any = {};
//     const next = vi.fn();

//     await createNewWalletController(req, res, next);

//     expect(next).toHaveBeenCalled();
//     const error = (next as any).mock.calls[0][0];
//     expect(error).toBeInstanceOf(AppError);
//   });

//   // Get wallet
//   test("Get user wallet: successful", async () => {
//     mockWhere.mockClear();
//     mockFirst.mockClear();

//     mockFirst.mockResolvedValueOnce({
//       id: 10,
//       balance: 300,
//       address: "us8350a25d32394bbcb95464f73537c377erwallet",
//       user_id: 5,
//     });

//     const req: any = {
//       user: { id: 5 },
//     };

//     const json = vi.fn();
//     const status = vi.fn(() => ({ json }));
//     const res: any = { status };
//     const next = vi.fn();

//     await getUserWalletController(req, res, next);

//     expect(mockedDb).toHaveBeenCalledWith("wallets");
//     expect(mockWhere).toHaveBeenCalledWith({ user_id: 5 });

//     expect(status).toHaveBeenCalledWith(200);
//     expect(json).toHaveBeenCalledWith({
//       status: true,
//       message: "Wallet retrived successfully.",
//       data: expect.any(Object),
//     });

//     expect(next).not.toHaveBeenCalled();
//   });

//   test("Get user wallet no wallet", async () => {
//     mockWhere.mockClear();
//     mockFirst.mockClear();

//     mockFirst.mockResolvedValueOnce(undefined);

//     const req: any = {
//       user: { id: 5 },
//     };

//     const res: any = {};
//     const next = vi.fn();

//     await getUserWalletController(req, res, next);

//     expect(next).toHaveBeenCalled();
//     const error = (next as any).mock.calls[0][0];
//     expect(error).toBeInstanceOf(AppError);
//   });
// });
