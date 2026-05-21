import { vi, test, expect, describe, beforeEach } from "vitest";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

import axios from "axios";
import verifyKarmaIdentity from "../../services/verifyKarmaIdentity.js";

describe("Verify karma identity tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("User found in karma blacklist", async () => {
    (axios.get as any).mockResolvedValue({
      data: {
        data: {
          karma_identity: "hamnu@gmail.com",
        },
      },
    });

    const result = await verifyKarmaIdentity("hamnu@gmail.com");

    expect(axios.get).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  test("User is clean", async () => {
    (axios.get as any).mockResolvedValue({
      data: {},
    });

    const result = await verifyKarmaIdentity("hamnu@gmail.com");

    expect(axios.get).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  test("Should handle api errors", async () => {
    const apiError = new Error(
      "We couldn't verify your access. Please check your API key and try again.",
    );

    (axios.get as any).mockRejectedValue(apiError);

    const result = await verifyKarmaIdentity("hamnu@gmail.com");

    expect(axios.get).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
