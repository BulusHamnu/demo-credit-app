// import { vi, expect, test, describe } from "vitest";
// import verifyKarmaIdentity from "../../../src/services/verifyKarmaIdentity.js";
// import axios from "axios";

// // mock axios.get
// let mockGet = vi.fn();

// // mock axios module
// vi.mock("axios", () => ({
//   default: {
//     get: (...args: any) => mockGet(...args),
//   },
// }));

// // mock env variables
// vi.mock("../../config/env.js", () => ({
//   ADJUSTOR_API_BASE: "https://adjutor.lendsqr.com/v2",
//   DEMO_CREDIT_ADJUSTOR_API_KEY: "demo-key",
// }));

// describe("Verify Karma Identity Test", () => {
//   test("Return true when karma_identity matches identifier", async () => {
//     // mock response from axios
//     mockGet.mockResolvedValueOnce({
//       data: { karma_identity: "hamnubulus@gmail.com" },
//     });

//     const result = await verifyKarmaIdentity("hamnubulus@gmail.com");

//     // axios was called with correct endpoint + headers
//     expect(mockGet).toHaveBeenCalledWith(
//       "https://adjutor.lendsqr.com/v2/verification/karma/hamnubulus@gmail.com",
//       {
//         headers: {
//           Authorization: `Bearer demo-key`,
//         },
//       },
//     );

//     // should return true
//     expect(result).toBe(true);
//   });

//   test("Return false when karma_identity does not match", async () => {
//     // axios response different from identifier
//     mockGet.mockResolvedValueOnce({
//       data: { karma_identity: "hamnubulus75@gmail.com" },
//     });

//     const result = await verifyKarmaIdentity("hamnubulus@gmail.com");

//     // axios was called again
//     expect(mockGet).toHaveBeenCalled();

//     // should return false
//     expect(result).toBe(false);
//   });
// });
