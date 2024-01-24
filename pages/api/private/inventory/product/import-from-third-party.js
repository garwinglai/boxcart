import { createProductBatchFromThirdParty } from "@/helper/server/prisma/inventory/product-schema";
import { isAuthServer } from "@/helper/server/auth/isAuthServer";

export default async function handler(req, res) {
  const isLoggedIn = await isAuthServer(req, res);

  if (!isLoggedIn) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const { method, body } = req;

  // const parsedBody = JSON.parse(body);

  if (method === "POST") {
    // Handle POST request
    const batchData = JSON.parse(body);

    const { success, error, products } = await createProductBatchFromThirdParty(
      batchData
    );

    if (success) {
      res.status(200).json({ products });
    } else {
      res.status(500).json({ error });
    }
  }
}
