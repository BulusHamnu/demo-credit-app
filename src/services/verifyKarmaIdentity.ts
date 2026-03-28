import {
  ADJUSTOR_API_BASE,
  DEMO_CREDIT_ADJUSTOR_API_KEY,
} from "../config/env.js";
import axios from "axios";

/* Karma identity lookup function */
export default async function verifyKarmaIdentity(
  identifier: string,
): Promise<boolean> {
  const endpoint = ADJUSTOR_API_BASE + "/verification/karma/" + identifier;

  const res = await axios.get(endpoint, {
    headers: {
      Authorization: `Bearer ${DEMO_CREDIT_ADJUSTOR_API_KEY}`,
    },
  });

  // Kyc was not verify i only receive mock data, so this is the solution i decided to use
  if (res.data.karma_identity === identifier) {
    return true;
  }

  return false;
}
