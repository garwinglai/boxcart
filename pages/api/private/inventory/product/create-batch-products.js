import { createBatchProductsInternal } from "@/helper/server/prisma/inventory/product-schema";

export default async function handler(req, res) {
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
