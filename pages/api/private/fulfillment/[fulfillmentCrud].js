import { isAuthServer } from "@/helper/server/auth/isAuthServer";
import { upsertFulfillmentServer } from "@/helper/server/prisma/fulfillment/fulfillment-crud";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, query, body } = req;
  if (method === "POST") {
    const { fulfillmentCrud } = query;

    if (fulfillmentCrud === "upsert") {
      const fulfillmentData = JSON.parse(body);

      const resFulfillmentUpsert = await upsertFulfillmentServer(
        fulfillmentData
      );
      const { success, value } = resFulfillmentUpsert;

      if (success) {
        res.status(200).json(value);
      } else {
        res.status(500).json(value);
      }
    }
  }
}
