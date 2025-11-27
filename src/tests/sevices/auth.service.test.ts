import { vi, expect, test, describe, beforeEach } from "vitest";
import { createNewUser, getUser } from "../../services/auth.service.js";

// mock database
let mockWhere = vi.fn().mockReturnThis();
let mockFirst = vi.fn().mockResolvedValue(undefined);
let mockInsert = vi.fn().mockResolvedValue([1]);
let mockUpdate = vi.fn().mockResolvedValue(1);

vi.mock("../../database/db.js", () => ({
  default: vi.fn(() => ({
    where: mockWhere,
    first: mockFirst,
    insert: mockInsert,
    update: mockUpdate,
  })),
}));

// verifyKarmaIdentity return false means user is NOT blacklisted
vi.mock("../../services/verifyKarmaIdentity.js", () => ({
  default: vi.fn(() => false),
}));

// mock function for generating access token
vi.mock("../../utils/helpers.js", () => ({
  generateAccessToken: vi.fn(() => "a43e8462-3dbb-4ece-9303-e2076237b7f3"),
}));

import { generateAccessToken } from "../../utils/helpers.js";
import verifyKarmaIdentity from "../../services/verifyKarmaIdentity.js";
import db from "../../database/db.js";

// test
describe("Auth Service Tests", () => {
  test("Create new user", async () => {
    await createNewUser("hamnubulus@gmail.com", "Bulus Hamnu");
    // verify karma was checked
    expect(verifyKarmaIdentity).toHaveBeenCalledWith("hamnubulus@gmail.com");

    // db was queried to check for existing user
    expect(db).toHaveBeenCalledWith("users");
    expect(mockFirst).toHaveBeenCalled();

    expect(mockWhere).toHaveBeenCalledWith({ email: "hamnubulus@gmail.com" });
    // token was generated
    expect(generateAccessToken).toHaveBeenCalled();

    // user was inserted
    expect(mockInsert).toHaveBeenCalledWith({
      email: "hamnubulus@gmail.com",
      full_name: "Bulus Hamnu",
      token: "a43e8462-3dbb-4ece-9303-e2076237b7f3",
    });
  });

  test("Get user", async () => {
    mockFirst.mockResolvedValueOnce({ email: "hamnubulus@gmail.com" });
    await getUser("hamnubulus@gmail.com");

    // db was queried for the user
    expect(db).toHaveBeenCalledWith("users");
    expect(mockFirst).toHaveBeenCalled();
  });
});
