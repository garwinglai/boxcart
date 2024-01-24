import { createBatchProductsInternal } from "@/helper/server/prisma/inventory/product-schema";
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
    const batchData = body;

    try {
      const { savedCount, errorCount, savedProducts, productWithErrors } =
        await createBatchProductsInternal(batchData);
      res
        .status(200)
        .json({ savedCount, errorCount, savedProducts, productWithErrors });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }
}
