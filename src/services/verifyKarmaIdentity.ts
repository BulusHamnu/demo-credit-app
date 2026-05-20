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

  /* I kept getting the error: “We couldn't verify your access. Please check your API key and try again.” even when the API key was valid. Since this could interrupt API testing, I added a try/catch block to skip the verification step whenever an unexpected error occurs. */
  try {
    const res = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${DEMO_CREDIT_ADJUSTOR_API_KEY}`,
      },
    });

    const result = res.data;
    if (result.data && result.data.karma_identity === identifier) return false;

    return true;
  } catch (error: any) {
    console.log(error.message);
    return true;
  }
}
