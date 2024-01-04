import { createDigitalProductBatchFromThirdParty } from "@/helper/server/prisma/inventory/product-schema";

export default async function handler(req, res) {
  const { method, body } = req;

  // const parsedBody = JSON.parse(body);

  if (method === "POST") {
    // Handle POST request
    const batchData = JSON.parse(body);

    const { success, error, products } =
      await createDigitalProductBatchFromThirdParty(batchData);

    if (success) {
      res.status(200).json({ products });
    } else {
      res.status(500).json({ error });
    }
  }
}
